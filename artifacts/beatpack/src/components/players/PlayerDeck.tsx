import { useState } from "react";
import { Link } from "wouter";
import { Play, Pause, ShoppingCart, Download } from "lucide-react";
import { Waveform, useAudioPlayer } from "@/components/BeatWaveform";
import { formatCurrency } from "@/lib/format";
import EmailDownloadModal from "@/components/EmailDownloadModal";

interface Beat {
  id: string; title: string; bpm?: number | null; key?: string | null;
  genre?: string | null; tags?: string[] | null;
  coverUrl?: string | null; audioPreviewUrl?: string | null;
  priceBasic?: number | null; artistSlug?: string | null; artistName?: string | null;
}

interface Theme { bg: string; cardBg: string; text: string; muted: string; border: string; accent: string; waveformPlayed: string; waveformUnplayed: string; }

export default function PlayerDeck({ beat, theme, onBuy }: { beat: Beat; theme: Theme; onBuy: (beat: Beat) => void }) {
  const { playing, progress, currentTime, duration, toggle, seek, fmt } = useAudioPlayer(beat.audioPreviewUrl);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const isDark = theme.bg === "#0A0A0A";
  const accentColor = isDark ? "#A78BFA" : theme.accent;

  const metaTags = [beat.genre, beat.bpm ? `${beat.bpm} BPM` : null, beat.key].filter(Boolean) as string[];
  const extraTags = (beat.tags ?? []).slice(0, 3);

  return (
    <>
      <div style={{
        display: "grid", gridTemplateColumns: "auto 1fr", gap: "0",
        background: theme.cardBg, border: `1px solid ${theme.border}`,
        borderRadius: "14px", overflow: "hidden",
      }}>
        <div style={{ width: "110px", height: "110px", background: theme.border, position: "relative", flexShrink: 0 }}>
          {beat.coverUrl
            ? <img src={beat.coverUrl} alt={beat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", color: theme.muted }}>♪</div>
          }
        </div>

        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
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
                width: "30px", height: "30px", borderRadius: "50%",
                background: playing ? accentColor : "transparent",
                border: `1.5px solid ${playing ? accentColor : theme.border}`,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s ease",
              }}>
                {playing
                  ? <Pause size={12} fill={isDark ? "#000" : theme.bg} color={isDark ? "#000" : theme.bg} />
                  : <Play size={12} fill={theme.text} color={theme.text} style={{ marginLeft: "2px" }} />
                }
              </button>
              <button onClick={() => onBuy(beat)} style={{
                height: "30px", padding: "0 10px", borderRadius: "9999px",
                background: accentColor, color: isDark ? "#000" : theme.bg, border: "none",
                fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "11px",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
              }}>
                <ShoppingCart size={10} />
                {beat.priceBasic ? formatCurrency(beat.priceBasic) : "Buy"}
              </button>
              {beat.audioPreviewUrl && (
                <button onClick={() => setDownloadOpen(true)} style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: "transparent", border: `1.5px solid ${theme.border}`,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Download size={12} color={theme.muted} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "5px" }}>
            {metaTags.map((tag) => (
              <span key={tag} style={{ background: theme.border, borderRadius: "4px", padding: "1px 6px", fontFamily: "'Figtree', sans-serif", fontSize: "10px", color: theme.muted, letterSpacing: "0.03em", fontWeight: 700 }}>
                {tag}
              </span>
            ))}
            {extraTags.map((tag) => (
              <span key={tag} style={{ background: "transparent", border: `1px solid ${theme.border}`, borderRadius: "4px", padding: "1px 6px", fontFamily: "'Figtree', sans-serif", fontSize: "10px", color: theme.muted, letterSpacing: "0.03em" }}>
                #{tag}
              </span>
            ))}
          </div>

          <div>
            <Waveform beatId={beat.id} progress={progress} onSeek={seek} playedColor={accentColor} unplayedColor={theme.waveformUnplayed} height={30} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Figtree', sans-serif", fontSize: "9px", color: theme.muted, marginTop: "2px", letterSpacing: "0.05em" }}>
              <span>{fmt(currentTime)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <EmailDownloadModal
        beatId={beat.id}
        beatTitle={beat.title}
        artistName={beat.artistName}
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
      />
    </>
  );
}
