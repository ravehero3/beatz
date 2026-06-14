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

export default function PlayerMinimal({ beat, theme, onBuy }: { beat: Beat; theme: Theme; onBuy: (beat: Beat) => void }) {
  const { playing, progress, toggle, seek } = useAudioPlayer(beat.audioPreviewUrl);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const metaParts = [beat.bpm ? `${beat.bpm} BPM` : null, beat.key, beat.genre].filter(Boolean);
  const tags = (beat.tags ?? []).slice(0, 3);

  return (
    <>
      <div
        style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "10px 12px", borderRadius: "12px",
          background: theme.cardBg, border: `1px solid ${theme.border}`,
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = theme.bg === "#0A0A0A" ? "#1a1a1a" : theme.bg; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = theme.cardBg; }}
      >
        <div style={{ width: "52px", height: "52px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: theme.border }}>
          {beat.coverUrl
            ? <img src={beat.coverUrl} alt={beat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", color: theme.muted }}>♪</div>
          }
        </div>

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

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "3px" }}>
            {beat.title}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginBottom: "4px" }}>
            {metaParts.map((m) => (
              <span key={m} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "10px", color: theme.muted, background: theme.border, borderRadius: "3px", padding: "1px 5px", fontWeight: 700 }}>
                {m}
              </span>
            ))}
            {tags.map((tag) => (
              <span key={tag} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "10px", color: theme.muted, background: "transparent", border: `1px solid ${theme.border}`, borderRadius: "3px", padding: "1px 5px" }}>
                #{tag}
              </span>
            ))}
          </div>
          <Waveform beatId={beat.id} progress={progress} onSeek={seek} playedColor={theme.waveformPlayed} unplayedColor={theme.waveformUnplayed} height={24} />
          {beat.artistName && (
            <Link href={`/artists/${beat.artistSlug ?? beat.id}`} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: theme.muted, textDecoration: "none", display: "block", marginTop: "2px" }}>
              {beat.artistName}
            </Link>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px", flexShrink: 0 }}>
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
          {beat.audioPreviewUrl && (
            <button onClick={() => setDownloadOpen(true)} style={{
              height: "24px", padding: "0 10px", borderRadius: "9999px",
              background: "transparent", color: theme.muted,
              border: `1px solid ${theme.border}`,
              fontFamily: "'Figtree', sans-serif", fontWeight: 500, fontSize: "10px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "3px",
            }}>
              <Download size={10} /> Free
            </button>
          )}
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
