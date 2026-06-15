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

interface Theme {
  bg: string; cardBg: string; text: string; muted: string; border: string;
  accent: string; waveformPlayed: string; waveformUnplayed: string;
}

function PlaylistRow({ beat, theme, onBuy, index }: {
  beat: Beat; theme: Theme; onBuy: (beat: Beat) => void; index: number;
}) {
  const { playing, progress, currentTime, duration, toggle, seek, fmt } = useAudioPlayer(beat.audioPreviewUrl);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isDark = theme.bg === "#0A0A0A";
  const accentColor = isDark ? "#A78BFA" : theme.accent;
  const hoverBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  const metaTags = [
    beat.bpm ? `${beat.bpm} BPM` : null,
    beat.key ?? null,
    beat.genre ?? null,
  ].filter(Boolean) as string[];

  const extraTags = (beat.tags ?? []).slice(0, 3);

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "32px 56px auto 1fr auto",
          alignItems: "center",
          gap: "0",
          padding: "10px 14px",
          borderRadius: "12px",
          background: hovered ? hoverBg : "transparent",
          border: `1px solid ${hovered ? theme.border : "transparent"}`,
          transition: "background 0.15s ease, border-color 0.15s ease",
          cursor: "default",
        }}
      >
        {/* Row number / play button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px" }}>
          {hovered || playing ? (
            <button
              onClick={toggle}
              style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: playing ? accentColor : "transparent",
                border: `1.5px solid ${playing ? accentColor : theme.border}`,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s ease", flexShrink: 0,
              }}
            >
              {playing
                ? <Pause size={11} fill={isDark ? "#000" : theme.bg} color={isDark ? "#000" : theme.bg} />
                : <Play size={11} fill={theme.text} color={theme.text} style={{ marginLeft: "1px" }} />
              }
            </button>
          ) : (
            <span style={{
              fontFamily: "'Figtree', sans-serif", fontSize: "13px",
              fontWeight: 500, color: theme.muted, width: "28px",
              textAlign: "center",
            }}>
              {index + 1}
            </span>
          )}
        </div>

        {/* Cover art */}
        <div style={{
          width: "48px", height: "48px", borderRadius: "8px",
          overflow: "hidden", flexShrink: 0, background: theme.border,
          marginLeft: "8px",
        }}>
          {beat.coverUrl
            ? <img src={beat.coverUrl} alt={beat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: theme.muted }}>♪</div>
          }
        </div>

        {/* Title + meta */}
        <div style={{ paddingLeft: "14px", paddingRight: "12px", minWidth: "160px", maxWidth: "220px" }}>
          <div style={{
            fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "14px",
            color: theme.text, overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap", marginBottom: "4px", letterSpacing: "-0.01em",
          }}>
            {beat.title}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
            {metaTags.map((tag) => (
              <span key={tag} style={{
                fontFamily: "'Figtree', sans-serif", fontSize: "10px",
                fontWeight: 700, color: theme.muted,
                background: theme.border, borderRadius: "4px", padding: "1px 5px",
                letterSpacing: "0.03em",
              }}>
                {tag}
              </span>
            ))}
            {extraTags.map((tag) => (
              <span key={tag} style={{
                fontFamily: "'Figtree', sans-serif", fontSize: "10px",
                color: theme.muted, background: "transparent",
                border: `1px solid ${theme.border}`, borderRadius: "4px", padding: "1px 5px",
              }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Waveform + time */}
        <div style={{ minWidth: 0 }}>
          <Waveform
            beatId={beat.id}
            progress={progress}
            onSeek={seek}
            playedColor={accentColor}
            unplayedColor={theme.waveformUnplayed}
            height={28}
          />
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: "'Figtree', sans-serif", fontSize: "9px",
            color: theme.muted, marginTop: "2px", letterSpacing: "0.05em",
          }}>
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Price + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "16px", flexShrink: 0 }}>
          {beat.priceBasic && (
            <span style={{
              fontFamily: "'Figtree', sans-serif", fontWeight: 700,
              fontSize: "13px", color: theme.text, whiteSpace: "nowrap",
            }}>
              {formatCurrency(beat.priceBasic)}
            </span>
          )}
          <button
            onClick={() => onBuy(beat)}
            title="Add to cart"
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: accentColor, color: isDark ? "#000" : theme.bg,
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "opacity 0.15s ease, transform 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <ShoppingCart size={13} />
          </button>
          {beat.audioPreviewUrl && (
            <button
              onClick={() => setDownloadOpen(true)}
              title="Free preview"
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "transparent", color: theme.muted,
                border: `1.5px solid ${theme.border}`,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "border-color 0.15s ease, opacity 0.15s ease",
                opacity: hovered ? 1 : 0.6,
              }}
            >
              <Download size={12} />
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

export default function PlayerPlaylist({ beats, theme, onBuy }: {
  beats: Beat[]; theme: Theme; onBuy: (beat: Beat) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingBottom: "64px" }}>
      {beats.map((beat, index) => (
        <PlaylistRow key={beat.id} beat={beat} theme={theme} onBuy={onBuy} index={index} />
      ))}
    </div>
  );
}
