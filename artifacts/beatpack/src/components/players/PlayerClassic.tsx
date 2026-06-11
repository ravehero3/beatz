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

export default function PlayerClassic({ beat, theme, onBuy }: { beat: Beat; theme: Theme; onBuy: (beat: Beat) => void }) {
  const { playing, progress, currentTime, duration, toggle, seek, fmt } = useAudioPlayer(beat.audioPreviewUrl);

  return (
    <div style={{
      background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px",
      overflow: "hidden", transition: "transform 0.2s ease, box-shadow 0.2s ease",
      display: "flex", flexDirection: "column",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
    >
      {/* Cover art */}
      <div style={{ position: "relative", aspectRatio: "1", background: beat.coverUrl ? undefined : theme.border, overflow: "hidden" }}>
        {beat.coverUrl
          ? <img src={beat.coverUrl} alt={beat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", color: theme.muted }}>♪</div>
        }
        <button onClick={toggle} style={{
          position: "absolute", bottom: "12px", right: "12px",
          width: "40px", height: "40px", borderRadius: "50%",
          background: theme.accent, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}>
          {playing
            ? <Pause size={16} fill={theme.bg} color={theme.bg} />
            : <Play size={16} fill={theme.bg} color={theme.bg} style={{ marginLeft: "2px" }} />
          }
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "14px", color: theme.text, marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {beat.title}
        </div>
        {beat.artistName && (
          <Link href={`/artists/${beat.artistSlug ?? beat.id}`} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: theme.muted, textDecoration: "none" }}>
            {beat.artistName}
          </Link>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", margin: "8px 0 10px" }}>
          {beat.genre && <span style={{ background: theme.border, borderRadius: "4px", padding: "2px 7px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: theme.muted }}>{beat.genre}</span>}
          {beat.bpm && <span style={{ background: theme.border, borderRadius: "4px", padding: "2px 7px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: theme.muted }}>{beat.bpm} BPM</span>}
          {beat.key && <span style={{ background: theme.border, borderRadius: "4px", padding: "2px 7px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: theme.muted }}>{beat.key}</span>}
        </div>
      </div>

      {/* Waveform */}
      <div style={{ padding: "0 14px" }}>
        <Waveform beatId={beat.id} progress={progress} onSeek={seek} playedColor={theme.waveformPlayed} unplayedColor={theme.waveformUnplayed} height={40} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Figtree', sans-serif", fontSize: "10px", color: theme.muted, margin: "3px 0 12px" }}>
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Buy */}
      <div style={{ padding: "0 14px 14px" }}>
        <button onClick={() => onBuy(beat)} style={{
          width: "100%", height: "36px", borderRadius: "9999px",
          background: theme.accent, color: theme.bg, border: "none",
          fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        }}>
          <ShoppingCart size={14} />
          {beat.priceBasic ? formatCurrency(beat.priceBasic) : "Buy"}
        </button>
      </div>
    </div>
  );
}
