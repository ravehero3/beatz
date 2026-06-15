import { useState } from "react";
import { Play, Pause, Share2, Download, ShoppingCart } from "lucide-react";
import { Waveform, useAudioPlayer } from "@/components/BeatWaveform";
import LicenseModal from "@/components/LicenseModal";
import EmailDownloadModal from "@/components/EmailDownloadModal";

export interface PlaylistBeat {
  id: string;
  title: string;
  bpm?: number | null;
  key?: string | null;
  genre?: string | null;
  tags?: string[] | null;
  coverUrl?: string | null;
  audioPreviewUrl?: string | null;
  priceBasic?: number | null;
  pricePremium?: number | null;
  priceExclusive?: number | null;
  artistSlug?: string | null;
  artistName?: string | null;
}

interface Theme {
  bg: string;
  cardBg: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  waveformPlayed: string;
  waveformUnplayed: string;
}

const F = "'Figtree', sans-serif";

function Chip({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{
      fontFamily: F,
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      color,
      background: bg,
      borderRadius: "5px",
      padding: "2px 6px",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

function IconBtn({
  onClick,
  title,
  color,
  borderColor,
  children,
}: {
  onClick?: () => void;
  title: string;
  color: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: hov ? color : "transparent",
        border: `1.5px solid ${hov ? color : borderColor}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.15s ease",
        color: hov ? "#FFFFFF" : color,
      }}
    >
      {children}
    </button>
  );
}

function PlaylistRow({
  beat,
  theme,
  index,
}: {
  beat: PlaylistBeat;
  theme: Theme;
  index: number;
}) {
  const { playing, progress, currentTime, duration, toggle, seek, fmt } = useAudioPlayer(beat.audioPreviewUrl);
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [artHov, setArtHov] = useState(false);
  const [copied, setCopied] = useState(false);

  const isDark = theme.bg === "#0A0A0A";
  const rowBg = hovered ? (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)") : "transparent";
  const borderColor = hovered ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)") : "transparent";
  const accentColor = isDark ? "#A78BFA" : "#3B82F6";
  const chipBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)";
  const chipColor = isDark ? "rgba(255,255,255,0.6)" : "#666666";
  const tagBg = isDark ? "transparent" : "transparent";
  const tagBorder = isDark ? "rgba(255,255,255,0.15)" : "#D4D4D4";

  const tags = (beat.tags ?? []).slice(0, 3);
  const metaBpm = beat.bpm ? `${beat.bpm} BPM` : null;
  const metaKey = beat.key ?? null;

  function handleShare() {
    const url = `${window.location.origin}/beats/${beat.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
          padding: "8px 12px",
          borderRadius: "14px",
          background: rowBg,
          border: `1px solid ${borderColor}`,
          transition: "background 0.15s ease, border-color 0.15s ease",
          minWidth: 0,
        }}
      >
        {/* Row number */}
        <div style={{ width: "28px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: F, fontSize: "12px", color: theme.muted, opacity: playing || hovered ? 0 : 1, transition: "opacity 0.1s", userSelect: "none" }}>
            {index + 1}
          </span>
        </div>

        {/* Artwork + play overlay */}
        <div
          style={{
            width: "52px", height: "52px", borderRadius: "10px",
            overflow: "hidden", flexShrink: 0, background: theme.border,
            position: "relative", cursor: "pointer", marginLeft: "2px",
          }}
          onMouseEnter={() => setArtHov(true)}
          onMouseLeave={() => setArtHov(false)}
          onClick={toggle}
        >
          {beat.coverUrl ? (
            <img
              src={beat.coverUrl}
              alt={beat.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", opacity: 0.3 }}>
              ♪
            </div>
          )}
          {/* Play/Pause overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: artHov || playing ? 1 : 0,
            transition: "opacity 0.15s ease",
            borderRadius: "10px",
          }}>
            {playing
              ? <Pause size={18} fill="#FFFFFF" color="#FFFFFF" />
              : <Play size={18} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: "2px" }} />
            }
          </div>
        </div>

        {/* Title */}
        <div style={{ paddingLeft: "14px", minWidth: "120px", maxWidth: "200px", flexShrink: 0, paddingRight: "12px" }}>
          <div style={{
            fontFamily: F, fontWeight: 600, fontSize: "14px", color: theme.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            letterSpacing: "-0.01em",
          }}>
            {beat.title}
          </div>
          <div style={{ fontFamily: F, fontSize: "11px", color: theme.muted, marginTop: "2px" }}>
            {fmt(currentTime)} / {fmt(duration)}
          </div>
        </div>

        {/* BPM + Key chips */}
        <div style={{ display: "flex", gap: "4px", flexShrink: 0, paddingRight: "10px" }}>
          {metaBpm && <Chip label={metaBpm} bg={chipBg} color={chipColor} />}
          {metaKey && <Chip label={metaKey} bg={chipBg} color={chipColor} />}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "3px", flexShrink: 0, paddingRight: "14px", minWidth: 0 }}>
          {tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: F, fontSize: "10px", color: theme.muted,
              border: `1px solid ${tagBorder}`,
              borderRadius: "4px", padding: "1px 5px",
              whiteSpace: "nowrap", background: tagBg,
            }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Waveform — flex fill */}
        <div style={{ flex: 1, minWidth: "80px", maxWidth: "340px" }}>
          <Waveform
            beatId={beat.id}
            progress={progress}
            onSeek={seek}
            playedColor={playing ? accentColor : theme.muted}
            unplayedColor={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}
            height={32}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "14px", flexShrink: 0 }}>
          <IconBtn
            onClick={handleShare}
            title={copied ? "Copied!" : "Share beat"}
            color={copied ? "#22C55E" : theme.muted}
            borderColor={isDark ? "rgba(255,255,255,0.15)" : "#DCDCDC"}
          >
            <Share2 size={13} />
          </IconBtn>
          <IconBtn
            onClick={() => setDownloadOpen(true)}
            title="Free MP3 preview"
            color={theme.muted}
            borderColor={isDark ? "rgba(255,255,255,0.15)" : "#DCDCDC"}
          >
            <Download size={13} />
          </IconBtn>
          <IconBtn
            onClick={() => setLicenseOpen(true)}
            title="Add to cart"
            color={accentColor}
            borderColor={accentColor}
          >
            <ShoppingCart size={13} />
          </IconBtn>
        </div>
      </div>

      <LicenseModal
        beat={beat}
        open={licenseOpen}
        onClose={() => setLicenseOpen(false)}
      />
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

export default function PlayerPlaylist({
  beats,
  theme,
  maxRows = 5,
}: {
  beats: PlaylistBeat[];
  theme: Theme;
  maxRows?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? beats : beats.slice(0, maxRows);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {visible.map((beat, index) => (
          <PlaylistRow key={beat.id} beat={beat} theme={theme} index={index} />
        ))}
      </div>
      {beats.length > maxRows && (
        <div style={{ textAlign: "center", paddingTop: "16px" }}>
          <button
            onClick={() => setShowAll((v) => !v)}
            style={{
              fontFamily: F, fontSize: "13px", fontWeight: 600,
              color: theme.muted, background: "none", border: `1px solid ${theme.border}`,
              borderRadius: "9999px", padding: "8px 20px", cursor: "pointer",
              transition: "border-color 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; e.currentTarget.style.borderColor = theme.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = theme.muted; e.currentTarget.style.borderColor = theme.border; }}
          >
            {showAll ? "Show less" : `Show all ${beats.length} beats`}
          </button>
        </div>
      )}
    </div>
  );
}
