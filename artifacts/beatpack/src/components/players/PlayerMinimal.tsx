import { Link } from "wouter";
import { Play, Pause, ShoppingCart } from "lucide-react";
import { Waveform, useAudioPlayer } from "@/components/BeatWaveform";
import { formatCurrency } from "@/lib/format";

interface Beat {
  id: string; title: string; bpm?: number | null; key?: string | null;
  genre?: string | null; coverUrl?: string | null; audioPreviewUrl?: string | null;
  priceBasic?: number | null; artistSlug?: string | null; artistName?: string | null;
}

interface Theme { bg: string; cardBg: string; text: string; muted: string; border: string; accent: string; waveformPlayed: string; waveformUnplayed: string; }

export default function PlayerMinimal({ beat, theme, onBuy }: { beat: Beat; theme: Theme; onBuy: (beat: Beat) => void }) {
  const { playing, progress, toggle, seek } = useAudioPlayer(beat.audioPreviewUrl);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "10px 12px", borderRadius: "12px",
      background: theme.cardBg, border: `1px solid ${theme.border}`,
      transition: "background 0.15s ease",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = theme.bg === "#0A0A0A" ? "#1a1a1a" : theme.bg; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = theme.cardBg; }}
    >
      {/* Cover */}
      <div style={{ width: "52px", height: "52px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: theme.border, position: "relative" }}>
        {beat.coverUrl
          ? <img src={beat.coverUrl} alt={beat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", color: theme.muted }}>♪</div>
        }
      </div>

      {/* Play button */}
      <button onClick={toggle} style={{
        width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
        background: playing ? theme.accent : "transparent",
        border: `1.5px solid ${theme.border}`, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s ease",
      }}>
        {playing
          ? <Pause size={13} fill={theme.bg} color={theme.bg} />
          : <Play size={13} fill={theme.text} color={theme.text} style={{ marginLeft: "2px" }} />
        }
      </button>

      {/* Title + waveform */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "4px" }}>
          <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {beat.title}
          </span>
          <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: theme.muted, flexShrink: 0 }}>
            {[beat.genre, beat.bpm ? `${beat.bpm} BPM` : null, beat.key].filter(Boolean).join(" · ")}
          </span>
        </div>
        <Waveform beatId={beat.id} progress={progress} onSeek={seek} playedColor={theme.waveformPlayed} unplayedColor={theme.waveformUnplayed} height={28} />
        {beat.artistName && (
          <Link href={`/artists/${beat.artistSlug ?? beat.id}`} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: theme.muted, textDecoration: "none", display: "block", marginTop: "2px" }}>
            {beat.artistName}
          </Link>
        )}
      </div>

      {/* Price + buy */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
        {beat.priceBasic && (
          <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "13px", color: theme.text }}>
            {formatCurrency(beat.priceBasic)}
          </span>
        )}
        <button onClick={() => onBuy(beat)} style={{
          height: "28px", padding: "0 12px", borderRadius: "9999px",
          background: theme.accent, color: theme.bg, border: "none",
          fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "11px",
          cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
        }}>
          <ShoppingCart size={11} /> Buy
        </button>
      </div>
    </div>
  );
}
