import { useRef, useEffect, useMemo, useState, useCallback } from "react";

function seedRng(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return () => {
    h ^= h << 13; h ^= h >> 17; h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
}

export function generateWaveform(beatId: string, bars = 480): number[] {
  const rng = seedRng(beatId || "default");
  return Array.from({ length: bars }, (_, i) => {
    const pos = i / bars;
    const env = Math.pow(Math.sin(pos * Math.PI), 0.35);
    const beat = i % 4 === 0 ? 1.15 : i % 2 === 0 ? 1.05 : 1.0;
    return Math.min(1, (0.12 + env * rng() * 0.88) * beat);
  });
}

interface WaveformProps {
  beatId: string;
  progress: number;
  onSeek?: (ratio: number) => void;
  playedColor?: string;
  unplayedColor?: string;
  height?: number;
}

export function Waveform({
  beatId,
  progress,
  onSeek,
  playedColor = "#0A0A0A",
  unplayedColor = "#E0E0E0",
  height = 48,
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bars = useMemo(() => generateWaveform(beatId), [beatId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth || 300;
    const h = height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const barW = w / bars.length;
    bars.forEach((v, i) => {
      const barH = Math.max(1, v * h * 0.9);
      const x = i * barW;
      const y = (h - barH) / 2;
      const lineW = Math.max(0.5, barW - 0.6);
      ctx.fillStyle = i / bars.length <= progress ? playedColor : unplayedColor;
      ctx.fillRect(x, y, lineW, barH);
    });
  }, [bars, progress, playedColor, unplayedColor, height]);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek?.((e.clientX - rect.left) / rect.width);
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{
        width: "100%",
        height: `${height}px`,
        cursor: onSeek ? "pointer" : "default",
        display: "block",
      }}
    />
  );
}

export function useAudioPlayer(audioUrl: string | null | undefined) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;
    const onMeta = () => setDuration(audio.duration || 0);
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    if (audioUrl) audio.src = audioUrl;
    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.src = "";
    };
  }, [audioUrl]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = ratio * audio.duration;
  }, []);

  function fmt(s: number) {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return { playing, progress, duration, currentTime, toggle, seek, fmt };
}
