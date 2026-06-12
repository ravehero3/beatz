import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

interface BottomPlayerBeat {
  id: string;
  title: string;
  artistName?: string | null;
  coverUrl?: string | null;
  audioUrl: string;
}

interface BottomPlayerProps {
  beat: BottomPlayerBeat;
  onClose: () => void;
}

export default function BottomPlayer({ beat, onClose }: BottomPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = beat.audioUrl;
    audio.volume = volume;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    return () => {
      audio.pause();
    };
  }, [beat.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => { if (!dragging) setCurrentTime(audio.currentTime); };
    const onDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("durationchange", onDuration);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [dragging]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); } else { audio.play(); }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      if (v === 0) { audioRef.current.muted = true; setMuted(true); }
      else { audioRef.current.muted = false; setMuted(false); }
    }
  }

  function handleSeekStart() { setDragging(true); }

  function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentTime(Number(e.target.value));
  }

  function commitSeek(value: number) {
    if (audioRef.current) audioRef.current.currentTime = value;
    setCurrentTime(value);
    setDragging(false);
  }

  function fmt(s: number) {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePct = (muted ? 0 : volume) * 100;

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(700px, calc(100vw - 32px))",
      zIndex: 100,
      background: "rgba(10, 10, 10, 0.86)",
      backdropFilter: "blur(28px) saturate(180%)",
      WebkitBackdropFilter: "blur(28px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.10)",
      borderRadius: "20px",
      padding: "0 16px",
      height: "72px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 8px 48px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08)",
    }}>
      <audio ref={audioRef} preload="auto" />

      {/* Cover + info */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: "0 0 auto", maxWidth: "180px" }}>
        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "10px",
          overflow: "hidden",
          background: "#222222",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}>
          {beat.coverUrl ? (
            <img src={beat.coverUrl} alt={beat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#555555", fontSize: "18px" }}>♪</div>
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 600,
            fontSize: "12px",
            color: "#FFFFFF",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{beat.title}</div>
          {beat.artistName && (
            <div style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: "11px",
              color: "rgba(255,255,255,0.45)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{beat.artistName}</div>
          )}
        </div>
      </div>

      {/* Play button */}
      <button
        onClick={togglePlay}
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.95)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)",
          transition: "transform 0.1s ease, background 0.15s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        {isPlaying
          ? <Pause size={14} fill="#0A0A0A" color="#0A0A0A" />
          : <Play size={14} fill="#0A0A0A" color="#0A0A0A" />
        }
      </button>

      {/* Scrubber */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
        <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", flexShrink: 0, width: "28px", textAlign: "right" }}>
          {fmt(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onMouseDown={handleSeekStart}
          onTouchStart={handleSeekStart}
          onChange={handleSeekChange}
          onMouseUp={(e) => commitSeek(Number((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => commitSeek(Number((e.currentTarget as HTMLInputElement).value))}
          style={{
            flex: 1,
            height: "3px",
            WebkitAppearance: "none",
            appearance: "none",
            background: `linear-gradient(to right, rgba(255,255,255,0.9) ${progress}%, rgba(255,255,255,0.15) ${progress}%)`,
            borderRadius: "2px",
            outline: "none",
            cursor: "pointer",
          }}
        />
        <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", flexShrink: 0, width: "28px" }}>
          {fmt(duration)}
        </span>
      </div>

      {/* Volume */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <button onClick={toggleMute} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", padding: "4px", display: "flex", transition: "color 0.15s ease" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)"; }}
        >
          {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={muted ? 0 : volume}
          onChange={handleVolumeChange}
          style={{
            width: "60px",
            height: "3px",
            WebkitAppearance: "none",
            appearance: "none",
            background: `linear-gradient(to right, rgba(255,255,255,0.8) ${volumePct}%, rgba(255,255,255,0.15) ${volumePct}%)`,
            borderRadius: "2px",
            outline: "none",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", padding: "4px", display: "flex", flexShrink: 0, transition: "color 0.15s ease" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
