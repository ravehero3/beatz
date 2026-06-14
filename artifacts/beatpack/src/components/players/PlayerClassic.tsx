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

export default function PlayerClassic({ beat, theme, onBuy }: { beat: Beat; theme: Theme; onBuy: (beat: Beat) => void }) {
  const { playing, progress, currentTime, duration, toggle, seek, fmt } = useAudioPlayer(beat.audioPreviewUrl);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const tags = (beat.tags ?? []).slice(0, 4);

  return (
    <>
      <div
        style={{
          background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px",
          overflow: "hidden", transition: "transform 0.2s ease, box-shadow 0.2s ease",
          display: "flex", flexDirection: "column",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
      >
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

        <div style={{ padding: "14px 14px 0" }}>
          <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "14px", color: theme.text, marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {beat.title}
          </div>
          {beat.artistName && (
            <Link href={`/artists/${beat.artistSlug ?? beat.id}`} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: theme.muted, textDecoration: "none" }}>
              {beat.artistName}
            </Link>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
            {beat.bpm && (
              <span style={{ background: theme.border, borderRadius: "5px", padding: "2px 7px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: theme.muted, fontWeight: 700 }}>
                {beat.bpm} BPM
              </span>
            )}
            {beat.key && (
              <span style={{ background: theme.border, borderRadius: "5px", padding: "2px 7px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: theme.muted, fontWeight: 700 }}>
                {beat.key}
              </span>
            )}
            {beat.genre && (
              <span style={{ background: theme.border, borderRadius: "5px", padding: "2px 7px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: theme.muted }}>
                {beat.genre}
              </span>
            )}
          </div>
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "5px", marginBottom: "6px" }}>
              {tags.map((tag) => (
                <span key={tag} style={{
                  background: "transparent", border: `1px solid ${theme.border}`,
                  borderRadius: "4px", padding: "1px 6px",
                  fontFamily: "'Figtree', sans-serif", fontSize: "10px", color: theme.muted,
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "8px 14px 0" }}>
          <Waveform beatId={beat.id} progress={progress} onSeek={seek} playedColor={theme.waveformPlayed} unplayedColor={theme.waveformUnplayed} height={40} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Figtree', sans-serif", fontSize: "10px", color: theme.muted, margin: "3px 0 12px" }}>
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <button onClick={() => onBuy(beat)} style={{
            width: "100%", height: "36px", borderRadius: "9999px",
            background: theme.accent, color: theme.bg, border: "none",
            fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          }}>
            <ShoppingCart size={14} />
            {beat.priceBasic ? formatCurrency(beat.priceBasic) : "Buy"}
          </button>
          {beat.audioPreviewUrl && (
            <button onClick={() => setDownloadOpen(true)} style={{
              width: "100%", height: "32px", borderRadius: "9999px",
              background: "transparent", color: theme.muted,
              border: `1px solid ${theme.border}`,
              fontFamily: "'Figtree', sans-serif", fontWeight: 500, fontSize: "12px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
            }}>
              <Download size={12} /> Free preview
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
