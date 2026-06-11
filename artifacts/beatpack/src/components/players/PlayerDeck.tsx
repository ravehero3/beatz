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

export default function PlayerDeck({ beat, theme, onBuy }: { beat: Beat; theme: Theme; onBuy: (beat: Beat) => void }) {
  const { playing, progress, currentTime, duration, toggle, seek, fmt } = useAudioPlayer(beat.audioPreviewUrl);

  const isDark = theme.bg === "#0A0A0A";
  const accentColor = isDark ? "#A78BFA" : theme.accent;

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "auto 1fr", gap: "0",
      background: theme.cardBg, border: `1px solid ${theme.border}`,
      borderRadius: "14px", overflow: "hidden",
    }}>
      {/* Cover */}
      <div style={{ width: "110px", height: "110px", background: theme.border, position: "relative", flexShrink: 0 }}>
        {beat.coverUrl
          ? <img src={beat.coverUrl} alt={beat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", color: theme.muted }}>♪</div>
        }
      </div>

      {/* Right panel */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
        {/* Top row: title + controls */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "14px", color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
              {beat.title}
            </div>
            {beat.artistName && (
              <Link href={`/artists/${beat.artistSlug ?? beat.id}`} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: theme.muted, textDecoration: "none" }}>
                {beat.artistName}
              </Link>
            )}
          </div>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <button onClick={toggle} style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: playing ? accentColor : "transparent",
              border: `1.5px solid ${playing ? accentColor : theme.border}`,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s ease",
            }}>
              {playing
                ? <Pause size={13} fill={isDark ? "#000" : theme.bg} color={isDark ? "#000" : theme.bg} />
                : <Play size={13} fill={theme.text} color={theme.text} style={{ marginLeft: "2px" }} />
              }
            </button>
            <button onClick={() => onBuy(beat)} style={{
              height: "32px", padding: "0 12px", borderRadius: "9999px",
              background: accentColor, color: isDark ? "#000" : theme.bg, border: "none",
              fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "12px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
            }}>
              <ShoppingCart size={11} />
              {beat.priceBasic ? formatCurrency(beat.priceBasic) : "Buy"}
            </button>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "6px" }}>
          {[beat.genre, beat.bpm ? `${beat.bpm} BPM` : null, beat.key].filter(Boolean).map((tag) => (
            <span key={tag} style={{ background: theme.border, borderRadius: "4px", padding: "1px 6px", fontFamily: "'Figtree', sans-serif", fontSize: "10px", color: theme.muted, letterSpacing: "0.03em" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Waveform + time */}
        <div>
          <Waveform beatId={beat.id} progress={progress} onSeek={seek} playedColor={accentColor} unplayedColor={theme.waveformUnplayed} height={32} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Figtree', sans-serif", fontSize: "9px", color: theme.muted, marginTop: "2px", letterSpacing: "0.05em" }}>
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
