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

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: "#0A0A0A",
      borderTop: "1px solid #222222",
      padding: "0 24px",
      height: "72px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
    }}>
      <audio ref={audioRef} preload="auto" />

      {/* Cover + info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: "0 0 220px" }}>
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#222222",
          flexShrink: 0,
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
            fontSize: "13px",
            color: "#FFFFFF",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{beat.title}</div>
          {beat.artistName && (
            <div style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: "11px",
              color: "#888888",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{beat.artistName}</div>
          )}
        </div>
      </div>

      {/* Controls + scrubber */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: 0 }}>
        <button
          onClick={togglePlay}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#FFFFFF",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {isPlaying
            ? <Pause size={16} fill="#0A0A0A" color="#0A0A0A" />
            : <Play size={16} fill="#0A0A0A" color="#0A0A0A" />
          }
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", maxWidth: "600px" }}>
          <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: "#888888", flexShrink: 0, width: "32px", textAlign: "right" }}>
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
              height: "4px",
              WebkitAppearance: "none",
              appearance: "none",
              background: `linear-gradient(to right, #FFFFFF ${progress}%, #444444 ${progress}%)`,
              borderRadius: "2px",
              outline: "none",
              cursor: "pointer",
            }}
          />
          <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: "#888888", flexShrink: 0, width: "32px" }}>
            {fmt(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "0 0 120px" }}>
        <button onClick={toggleMute} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888", padding: "4px", display: "flex" }}>
          {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={muted ? 0 : volume}
          onChange={handleVolumeChange}
          style={{
            width: "70px",
            height: "4px",
            WebkitAppearance: "none",
            appearance: "none",
            background: `linear-gradient(to right, #FFFFFF ${(muted ? 0 : volume) * 100}%, #444444 ${(muted ? 0 : volume) * 100}%)`,
            borderRadius: "2px",
            outline: "none",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#555555", padding: "4px", display: "flex", flexShrink: 0 }}
      >
        <X size={18} />
      </button>
    </div>
  );
}
