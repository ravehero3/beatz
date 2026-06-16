import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import StudioLayout from "./StudioLayout";
import { Upload, X, Instagram, Youtube } from "lucide-react";

const F = "'Figtree', sans-serif";
const DIG = "'Courier New', monospace";

/* ─── Themes ──────────────────────────────────────── */
const LAYOUTS = [
  { id: "light", label: "Light",  bg: "#FFFFFF", text: "#0A0A0A", muted: "#888", card: "#F9F9F9", border: "#E5E5E5", accent: "#0A0A0A" },
  { id: "grey",  label: "Grey",   bg: "#F5F5F5", text: "#0A0A0A", muted: "#666", card: "#FFFFFF", border: "#E0E0E0", accent: "#0A0A0A" },
  { id: "dark",  label: "Dark",   bg: "#0A0A0A", text: "#FFFFFF", muted: "#888", card: "#141414", border: "#2A2A2A", accent: "#A78BFA" },
];

/* ─── Deterministic waveform ──────────────────────── */
function genBars(seed: string, n: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffff;
  const bars: number[] = [];
  for (let i = 0; i < n; i++) {
    h = (h * 1664525 + 1013904223) & 0xffffffff;
    bars.push(0.15 + ((h >>> 0 & 0xff) / 255) * 0.85);
  }
  return bars;
}

/* ─── Shared sub-components ───────────────────────── */
function SInput({ value, onChange, placeholder, type = "text", mono, textarea }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; mono?: boolean; textarea?: boolean;
}) {
  const base: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: "10px",
    border: "1px solid #E5E5E5", fontFamily: mono ? DIG : F,
    fontSize: "14px", outline: "none", boxSizing: "border-box", background: "#FFFFFF", resize: "vertical",
  };
  if (textarea) return (
    <textarea value={value} placeholder={placeholder} rows={3} onChange={(e) => onChange(e.target.value)}
      style={{ ...base, height: "auto" }}
      onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
      onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")} />
  );
  return (
    <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
      style={{ ...base, height: "40px" }}
      onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
      onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")} />
  );
}

function ImageUploadCard({ value, onChange, token, label, hint, aspectRatio = "16/6", circle, acceptPng }: {
  value: string; onChange: (url: string) => void; token: string | null;
  label: string; hint?: string; aspectRatio?: string; circle?: boolean; acceptPng?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [hovering, setHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } finally { setUploading(false); }
  }

  const size = circle ? "96px" : "100%";
  return (
    <div>
      <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "8px" }}>{label}</label>
      <div onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
        style={{
          width: size, aspectRatio: circle ? "1" : aspectRatio,
          borderRadius: circle ? "50%" : "12px",
          border: value ? "none" : "2px dashed #E5E5E5",
          overflow: "hidden", cursor: "pointer", position: "relative",
          background: value ? "transparent" : "#F9F9F9",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        {value && <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: circle ? "cover" : "contain", display: "block" }} />}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
          background: value ? (hovering ? "rgba(0,0,0,0.5)" : "transparent") : "transparent",
          transition: "background 0.2s", pointerEvents: "none", padding: circle ? "8px" : "12px",
        }}>
          {(!value || hovering) && (uploading
            ? <div style={{ fontFamily: F, fontSize: "11px", color: value ? "#fff" : "#AAA" }}>Uploading…</div>
            : <><Upload size={circle ? 16 : 18} color={value ? "#fff" : "#AAA"} />
              <div style={{ fontFamily: F, fontSize: "11px", color: value ? "#fff" : "#AAA", textAlign: "center", lineHeight: 1.3 }}>{value ? "Change" : "Click to upload"}</div></>
          )}
        </div>
        <input ref={inputRef} type="file" accept={acceptPng ? "image/png" : "image/jpeg,image/png,image/webp,image/gif"}
          style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      </div>
      {hint && <p style={{ fontFamily: F, fontSize: "11px", color: "#AAA", marginTop: "6px" }}>{hint}</p>}
    </div>
  );
}

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>{children}</div>
);
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: F, fontWeight: 700, fontSize: "15px", color: "#0A0A0A", letterSpacing: "-0.01em", marginBottom: "4px" }}>{children}</div>
);
const SectionSub = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontFamily: F, fontSize: "13px", color: "#888", marginBottom: "16px", lineHeight: 1.6 }}>{children}</p>
);

/* ─── Player option previews ──────────────────────── */
const FAKE_BARS = genBars("sample-beat-preview", 60);
const FAKE_BARS_SM = genBars("sample-beat-list-1", 30);
const FAKE_BARS_SM2 = genBars("sample-beat-list-2", 30);

function WaveformBar({ bars, progress = 0.35, accent = "#0A0A0A", track = "#E5E5E5", height = 28 }: {
  bars: number[]; progress?: number; accent?: string; track?: string; height?: number;
}) {
  const cut = Math.floor(bars.length * progress);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5px", height: `${height}px` }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: "2px", flexShrink: 0, borderRadius: "1px",
          height: `${Math.max(3, h * height * 0.9)}px`,
          background: i < cut ? accent : track,
          transition: "background 0.2s",
        }} />
      ))}
    </div>
  );
}

/* Player 1: Carded */
function PlayerPreviewCarded() {
  return (
    <div style={{ background: "#F9F9F9", borderRadius: "14px", overflow: "hidden", border: "1px solid #E5E5E5" }}>
      {/* Featured beat card */}
      <div style={{ background: "#FFFFFF", margin: "12px", borderRadius: "12px", padding: "12px", border: "1px solid #EBEBEB", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "10px", background: "linear-gradient(135deg,#667eea,#764ba2)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>♪</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: "13px", color: "#0A0A0A", marginBottom: "2px" }}>Dark Nights</div>
            <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
              <span style={{ fontFamily: F, fontSize: "9px", fontWeight: 600, padding: "1px 5px", borderRadius: "4px", background: "rgba(124,58,237,0.1)", color: "#7C3AED" }}>140 BPM</span>
              <span style={{ fontFamily: F, fontSize: "9px", fontWeight: 600, padding: "1px 5px", borderRadius: "4px", background: "#F0F0F0", color: "#666" }}>Hip-Hop</span>
            </div>
            <WaveformBar bars={FAKE_BARS} progress={0.32} accent="#7C3AED" track="rgba(124,58,237,0.15)" height={22} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
              <span style={{ fontFamily: F, fontSize: "9px", color: "#999" }}>1:02</span>
              <span style={{ fontFamily: F, fontSize: "9px", color: "#BBB" }}>3:12</span>
            </div>
          </div>
        </div>
      </div>
      {/* Beat list */}
      <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: "5px" }}>
        {[["Summer Vibes", "145 BPM", 0.55], ["Cold World", "138 BPM", 0.2]].map(([title, bpm, prog]) => (
          <div key={title as string} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFFFFF", padding: "7px 10px", borderRadius: "10px", border: "1px solid #EBEBEB" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#F0F0F0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#BBB" }}>♪</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F, fontSize: "10px", fontWeight: 600, color: "#0A0A0A" }}>{title as string}</div>
              <div style={{ fontFamily: F, fontSize: "9px", color: "#AAA" }}>{bpm as string}</div>
            </div>
            <WaveformBar bars={FAKE_BARS_SM} progress={prog as number} accent="#0A0A0A" track="#E5E5E5" height={16} />
            <div style={{ height: "22px", padding: "0 8px", borderRadius: "11px", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: "9px", fontWeight: 700, color: "#FFF", flexShrink: 0 }}>499 Kč</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Player 2: Open (no card, Spotify-style rows) */
function PlayerPreviewOpen() {
  return (
    <div style={{ background: "#FAFAFA", borderRadius: "14px", padding: "12px", border: "1px solid #E5E5E5" }}>
      {/* Featured beat — no card border, open style */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "8px", background: "linear-gradient(135deg,#f093fb,#f5576c)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>♪</div>
          <div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: "13px", color: "#0A0A0A" }}>Dark Nights</div>
            <div style={{ fontFamily: F, fontSize: "10px", color: "#999", marginTop: "1px" }}>Marek Novák · 140 BPM · Hip-Hop</div>
          </div>
        </div>
        <WaveformBar bars={FAKE_BARS} progress={0.32} accent="#f5576c" track="rgba(245,87,108,0.15)" height={24} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
          <span style={{ fontFamily: F, fontSize: "9px", color: "#f5576c" }}>1:02</span>
          <span style={{ fontFamily: F, fontSize: "9px", color: "#BBB" }}>3:12</span>
        </div>
      </div>
      {/* Divider */}
      <div style={{ height: "1px", background: "#EBEBEB", marginBottom: "10px" }} />
      {/* Beat rows — no card, Spotify-style */}
      {[["Summer Vibes", "145 BPM", 0.55, "#4facfe"], ["Cold World", "138 BPM", 0.2, "#43e97b"]].map(([title, bpm, prog, col], idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0", borderBottom: idx === 0 ? "1px solid #F0F0F0" : "none" }}>
          <span style={{ fontFamily: F, fontSize: "10px", color: "#CCC", width: "14px", textAlign: "center" }}>{idx + 2}</span>
          <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#EBEBEB", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#CCC" }}>♪</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: "#0A0A0A" }}>{title as string}</div>
            <div style={{ fontFamily: F, fontSize: "9px", color: "#AAA" }}>{bpm as string}</div>
          </div>
          <WaveformBar bars={FAKE_BARS_SM2} progress={prog as number} accent={col as string} track="#EBEBEB" height={16} />
          <span style={{ fontFamily: F, fontSize: "10px", fontWeight: 600, color: "#0A0A0A", flexShrink: 0 }}>499 Kč</span>
        </div>
      ))}
    </div>
  );
}

/* Player 3: Digital (Winamp-style) */
function PlayerPreviewDigital() {
  return (
    <div style={{ background: "#1A1A2E", borderRadius: "14px", padding: "12px", border: "1px solid #2A2A4A", fontFamily: DIG }}>
      {/* LCD header */}
      <div style={{ background: "#0D0D1A", borderRadius: "8px", padding: "8px 12px", marginBottom: "10px", border: "1px solid #2A2A4A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontSize: "8px", color: "#00FF41", letterSpacing: "0.15em", textTransform: "uppercase" }}>▶ PLAYING</span>
          <span style={{ fontSize: "9px", color: "#00FF41", letterSpacing: "0.1em" }}>1:02 / 3:12</span>
        </div>
        <div style={{ fontSize: "11px", color: "#00FF41", letterSpacing: "0.05em", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          01. DARK NIGHTS — 140 BPM
        </div>
        {/* Digital waveform */}
        <div style={{ display: "flex", alignItems: "center", gap: "1px", height: "20px" }}>
          {FAKE_BARS.map((h, i) => (
            <div key={i} style={{
              width: "2px", flexShrink: 0, borderRadius: "1px",
              height: `${Math.max(2, h * 18)}px`,
              background: i < Math.floor(FAKE_BARS.length * 0.32) ? "#00FF41" : (i % 3 === 0 ? "#004D18" : "#003D14"),
            }} />
          ))}
        </div>
        {/* Progress bar */}
        <div style={{ height: "3px", background: "#002A0C", borderRadius: "2px", marginTop: "5px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "32%", height: "100%", background: "#00FF41", borderRadius: "2px" }} />
        </div>
      </div>
      {/* Track list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {[["01", "DARK NIGHTS", "3:12", true], ["02", "SUMMER VIBES", "2:58", false], ["03", "COLD WORLD", "3:44", false]].map(([num, title, dur, active]) => (
          <div key={num as string} style={{
            display: "flex", gap: "8px", alignItems: "center",
            padding: "4px 8px", borderRadius: "4px",
            background: active ? "rgba(0,255,65,0.08)" : "transparent",
            border: `1px solid ${active ? "rgba(0,255,65,0.2)" : "transparent"}`,
          }}>
            <span style={{ fontSize: "9px", color: active ? "#00FF41" : "#444", width: "14px" }}>{num as string}</span>
            <span style={{ flex: 1, fontSize: "9px", color: active ? "#00FF41" : "#888", letterSpacing: "0.05em" }}>{title as string}</span>
            <span style={{ fontSize: "9px", color: active ? "#00AA30" : "#444" }}>{dur as string}</span>
            <span style={{ fontSize: "9px", color: active ? "#00FF41" : "#555" }}>499Kč</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PLAYERS = [
  { id: "carded",  label: "Carded",  desc: "Card-framed beats with large featured section", Preview: PlayerPreviewCarded  },
  { id: "open",    label: "Open",    desc: "Borderless rows — clean Spotify-style layout",  Preview: PlayerPreviewOpen    },
  { id: "digital", label: "Digital", desc: "Retro digital display — Winamp-inspired",       Preview: PlayerPreviewDigital },
];

/* ─── Music Producer Modal ────────────────────────── */
function ProducerModal({ open, onClose, displayName, profilePictureUrl, slug, bio, socialInstagram, socialYoutube, socialSoundcloud, theme }: {
  open: boolean; onClose: () => void;
  displayName: string; profilePictureUrl: string; slug: string; bio: string;
  socialInstagram: string; socialYoutube: string; socialSoundcloud: string;
  theme: typeof LAYOUTS[0];
}) {
  if (!open) return null;
  const isDark = theme.id === "dark";
  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: "16px",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: isDark ? "#1A1A1A" : "#FFFFFF",
        borderRadius: "20px",
        padding: "28px 24px",
        width: "260px",
        textAlign: "center",
        boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        position: "relative",
        border: isDark ? "1px solid #2A2A2A" : "none",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "12px", right: "12px",
          width: "26px", height: "26px", borderRadius: "50%",
          background: isDark ? "#2A2A2A" : "#F5F5F5", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isDark ? "#888" : "#888",
        }}><X size={12} /></button>

        {/* Avatar */}
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          background: isDark ? "#2A2A2A" : "#F0F0F0",
          overflow: "hidden", margin: "0 auto 12px",
          border: `3px solid ${isDark ? "#333" : "#EBEBEB"}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        }}>
          {profilePictureUrl
            ? <img src={profilePictureUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: isDark ? "#444" : "#CCC" }}>♪</div>
          }
        </div>

        <div style={{ fontFamily: F, fontWeight: 800, fontSize: "16px", color: theme.text, letterSpacing: "-0.02em", marginBottom: "2px" }}>
          {displayName || "Your Name"}
        </div>
        {slug && <div style={{ fontFamily: F, fontSize: "11px", color: theme.muted, marginBottom: bio ? "10px" : "0" }}>@{slug}</div>}
        {bio && <p style={{ fontFamily: F, fontSize: "11px", color: theme.muted, lineHeight: 1.55, margin: "8px 0 12px" }}>{bio}</p>}

        {/* Socials */}
        {(socialInstagram || socialYoutube || socialSoundcloud) && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
            {socialInstagram && (
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${isDark ? "#333" : "#E5E5E5"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Instagram size={13} color={theme.muted} />
              </div>
            )}
            {socialYoutube && (
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${isDark ? "#333" : "#E5E5E5"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Youtube size={13} color={theme.muted} />
              </div>
            )}
            {socialSoundcloud && (
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${isDark ? "#333" : "#E5E5E5"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill={theme.muted}><path d="M11.56 8.87V17h8.76c1.04 0 1.68-.69 1.68-1.56 0-.76-.54-1.43-1.27-1.55v-.08c0-1.44-1.15-2.61-2.56-2.61-.28 0-.55.05-.8.13C16.9 9.87 15.47 9 13.83 9c-.87 0-1.67.29-2.27.87zM0 15.24c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76V12.1a1.72 1.72 0 1 0-3.44 0v3.14zm5.01 1.52c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76V10.2a1.72 1.72 0 1 0-3.44 0v6.56zm-2.5-.11c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76v-4.35a1.72 1.72 0 1 0-3.44 0v4.35z" /></svg>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Store Preview ───────────────────────────────── */
function StorePreview({
  displayName, bio, bannerUrl, profilePictureUrl, logoUrl, heroLogoUrl,
  socialInstagram, socialYoutube, socialSoundcloud, layout, player, slug,
}: {
  displayName: string; bio: string; bannerUrl: string; profilePictureUrl: string;
  logoUrl: string; heroLogoUrl: string;
  socialInstagram: string; socialYoutube: string; socialSoundcloud: string;
  layout: string; player: string; slug: string;
}) {
  const theme = LAYOUTS.find((l) => l.id === layout) ?? LAYOUTS[0];
  const isDark = layout === "dark";
  const [producerModalOpen, setProducerModalOpen] = useState(false);

  /* Featured beat waveform */
  const featBars = genBars("featured-dark-nights", 70);
  const listBars1 = genBars("list-beat-1", 32);
  const listBars2 = genBars("list-beat-2", 32);

  const featuredAccent = isDark ? "#A78BFA" : player === "digital" ? "#00FF41" : "#0A0A0A";
  const featuredTrack = isDark ? "rgba(167,139,250,0.2)" : player === "digital" ? "rgba(0,255,65,0.12)" : "#E5E5E5";

  /* ── Beat list row (shared for carded + open) ── */
  function BeatRow({ title, bpm, bars, progress, idx }: { title: string; bpm: string; bars: number[]; progress: number; idx: number }) {
    if (player === "digital") {
      return (
        <div style={{
          display: "flex", gap: "6px", alignItems: "center",
          padding: "3px 6px", borderRadius: "3px",
          background: idx === 0 ? "rgba(0,255,65,0.08)" : "transparent",
          border: `1px solid ${idx === 0 ? "rgba(0,255,65,0.15)" : "transparent"}`,
          fontFamily: DIG,
        }}>
          <span style={{ fontSize: "8px", color: idx === 0 ? "#00FF41" : "#444", width: "12px" }}>0{idx + 2}</span>
          <span style={{ flex: 1, fontSize: "8px", color: idx === 0 ? "#00FF41" : "#666", letterSpacing: "0.05em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title.toUpperCase()}</span>
          <span style={{ fontSize: "8px", color: idx === 0 ? "#00AA30" : "#444", flexShrink: 0 }}>499Kč</span>
        </div>
      );
    }
    const rowBg = player === "carded" ? theme.card : "transparent";
    const rowBorder = player === "carded" ? `1px solid ${theme.border}` : "none";
    const accent = isDark ? "#A78BFA" : "#0A0A0A";
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: "7px",
        padding: player === "carded" ? "6px 8px" : "5px 0",
        borderRadius: player === "carded" ? "8px" : "0",
        background: rowBg, border: rowBorder,
        borderBottom: player === "open" && idx === 0 ? `1px solid ${theme.border}` : undefined,
      }}>
        <span style={{ fontFamily: F, fontSize: "9px", color: isDark ? "#555" : "#CCC", width: "12px", textAlign: "center" }}>{idx + 2}</span>
        <div style={{ width: "26px", height: "26px", borderRadius: "5px", background: theme.border, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: theme.muted }}>♪</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F, fontSize: "10px", fontWeight: 600, color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
          <div style={{ fontFamily: F, fontSize: "8px", color: theme.muted }}>{bpm}</div>
        </div>
        <WaveformBar bars={bars} progress={progress} accent={accent} track={theme.border} height={14} />
        <div style={{ height: "20px", padding: "0 7px", borderRadius: "10px", background: theme.text, fontFamily: F, fontSize: "8px", fontWeight: 700, color: theme.bg, display: "flex", alignItems: "center", flexShrink: 0 }}>499 Kč</div>
      </div>
    );
  }

  return (
    <div style={{
      background: theme.bg, borderRadius: "16px", overflow: "hidden",
      border: `1px solid ${isDark ? "#2A2A2A" : "#E5E5E5"}`,
      fontFamily: F, position: "relative",
    }}>
      {/* ── Store Header ── */}
      <div style={{
        height: "36px", background: isDark ? "rgba(10,10,10,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${isDark ? "#1F1F1F" : "#F0F0F0"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 12px", position: "relative",
      }}>
        {/* Back arrow */}
        <div style={{ position: "absolute", left: "12px", color: theme.muted, fontSize: "14px", cursor: "pointer" }}>←</div>

        {/* Centered logo — clickable → opens producer modal */}
        <button onClick={() => setProducerModalOpen(true)} style={{
          background: "transparent", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "3px 6px", borderRadius: "6px",
          maxWidth: "160px",
          transition: "background 0.15s",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? "#1A1A1A" : "#F5F5F5"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          title="Kliknutím zobrazíte profil producenta"
        >
          {logoUrl
            ? <img src={logoUrl} alt="" style={{ height: "18px", maxWidth: "140px", objectFit: "contain" }} />
            : <span style={{ fontFamily: F, fontWeight: 800, fontSize: "13px", color: theme.text, letterSpacing: "-0.02em" }}>{displayName || "Váš obchod"}</span>
          }
        </button>

        {/* Right — heart + cart */}
        <div style={{ position: "absolute", right: "12px", display: "flex", gap: "5px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: `1.5px solid ${isDark ? "#2A2A2A" : "#E5E5E5"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: theme.muted }}>♡</div>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: `1.5px solid ${isDark ? "#2A2A2A" : "#E5E5E5"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: theme.muted }}>🛒</div>
        </div>
      </div>

      {/* ── Hero Image ── */}
      <div style={{
        width: "100%", height: "100px",
        background: bannerUrl ? `url(${bannerUrl}) center/cover no-repeat` : (isDark ? "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)" : "linear-gradient(135deg,#f5f7fa,#c3cfe2)"),
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
        {/* Hero logo centered */}
        {heroLogoUrl
          ? <img src={heroLogoUrl} alt="" style={{ position: "relative", zIndex: 1, height: "32px", maxWidth: "200px", objectFit: "contain", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }} />
          : <span style={{ position: "relative", zIndex: 1, fontFamily: F, fontWeight: 900, fontSize: "18px", color: "#FFFFFF", letterSpacing: "-0.03em", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
              {displayName || "Váš obchod"}
            </span>
        }
      </div>

      {/* ── Beat Player Section ── */}
      <div style={{ padding: "10px" }}>
        {/* --- Digital player --- */}
        {player === "digital" ? (
          <div style={{ background: "#0D0D1A", borderRadius: "10px", padding: "10px", border: "1px solid #1A1A3A" }}>
            {/* LCD header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontFamily: DIG, fontSize: "8px", color: "#00FF41", letterSpacing: "0.12em" }}>▶ PLAYING</span>
              <span style={{ fontFamily: DIG, fontSize: "9px", color: "#00FF41" }}>1:02 / 3:12</span>
            </div>
            <div style={{ fontFamily: DIG, fontSize: "10px", color: "#00FF41", letterSpacing: "0.05em", marginBottom: "5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              01. DARK NIGHTS — MAREK NOVÁK
            </div>
            <WaveformBar bars={featBars} progress={0.32} accent="#00FF41" track="rgba(0,255,65,0.1)" height={18} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px", marginBottom: "8px" }}>
              <span style={{ fontFamily: DIG, fontSize: "8px", color: "#00AA30" }}>1:02</span>
              <span style={{ fontFamily: DIG, fontSize: "8px", color: "#336633" }}>3:12</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <BeatRow title="Summer Vibes" bpm="145 BPM" bars={listBars1} progress={0} idx={0} />
              <BeatRow title="Cold World" bpm="138 BPM" bars={listBars2} progress={0} idx={1} />
            </div>
          </div>
        ) : (
          <>
            {/* Featured beat ── Carded or Open */}
            <div style={{
              background: player === "carded" ? theme.card : "transparent",
              border: player === "carded" ? `1px solid ${theme.border}` : "none",
              borderRadius: "10px",
              padding: player === "carded" ? "10px" : "0 0 10px 0",
              marginBottom: "8px",
              boxShadow: player === "carded" ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "8px",
                  background: isDark ? "#2A2A2A" : "linear-gradient(135deg,#667eea,#764ba2)",
                  flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px",
                }}>♪</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: "11px", color: theme.text, marginBottom: "2px" }}>Dark Nights</div>
                  <div style={{ display: "flex", gap: "3px", marginBottom: "6px" }}>
                    <span style={{ fontFamily: F, fontSize: "8px", fontWeight: 600, padding: "1px 4px", borderRadius: "3px", background: isDark ? "rgba(167,139,250,0.15)" : "rgba(124,58,237,0.1)", color: isDark ? "#A78BFA" : "#7C3AED" }}>140 BPM</span>
                    <span style={{ fontFamily: F, fontSize: "8px", padding: "1px 4px", borderRadius: "3px", background: isDark ? "#1F1F1F" : "#F0F0F0", color: theme.muted }}>Hip-Hop</span>
                  </div>
                  <WaveformBar bars={featBars} progress={0.32} accent={featuredAccent} track={featuredTrack} height={18} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                    <span style={{ fontFamily: F, fontSize: "8px", color: featuredAccent }}>1:02</span>
                    <span style={{ fontFamily: F, fontSize: "8px", color: theme.muted }}>3:12</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Beat list */}
            <div style={{ display: "flex", flexDirection: "column", gap: player === "carded" ? "5px" : "4px" }}>
              <BeatRow title="Summer Vibes" bpm="145 BPM · Trap" bars={listBars1} progress={0.55} idx={0} />
              <BeatRow title="Cold World" bpm="138 BPM · Hip-Hop" bars={listBars2} progress={0.2} idx={1} />
            </div>
          </>
        )}
      </div>

      {/* Music Producer Modal */}
      <ProducerModal
        open={producerModalOpen}
        onClose={() => setProducerModalOpen(false)}
        displayName={displayName}
        profilePictureUrl={profilePictureUrl}
        slug={slug ?? ""}
        bio={bio}
        socialInstagram={socialInstagram}
        socialYoutube={socialYoutube}
        socialSoundcloud={socialSoundcloud}
        theme={theme}
      />
    </div>
  );
}

/* ─── Main page ────────────────────────────────────── */
export default function StoreSettingsPage() {
  const { token } = useAuthStore();
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [heroLogoUrl, setHeroLogoUrl] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");
  const [socialSoundcloud, setSocialSoundcloud] = useState("");
  const [layout, setLayout] = useState("light");
  const [player, setPlayer] = useState("carded");
  const [bankIban, setBankIban] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/artists/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.slug)              setSlug(data.slug);
        if (data.displayName)       setDisplayName(data.displayName);
        if (data.bio)               setBio(data.bio);
        if (data.bannerUrl)         setBannerUrl(data.bannerUrl);
        if (data.profilePictureUrl) setProfilePictureUrl(data.profilePictureUrl);
        if (data.logoUrl)           setLogoUrl(data.logoUrl);
        if (data.heroLogoUrl)       setHeroLogoUrl(data.heroLogoUrl);
        if (data.socialInstagram)   setSocialInstagram(data.socialInstagram);
        if (data.socialYoutube)     setSocialYoutube(data.socialYoutube);
        if (data.socialSoundcloud)  setSocialSoundcloud(data.socialSoundcloud);
        if (data.storeTemplate)     setLayout(data.storeTemplate);
        if (data.playerStyle)       setPlayer(data.playerStyle);
        if (data.bankIban)          setBankIban(data.bankIban);
        if (data.bankAccountName)   setBankAccountName(data.bankAccountName);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/artists/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        displayName: displayName.trim() || null,
        bio: bio.trim() || null,
        bannerUrl: bannerUrl || null,
        profilePictureUrl: profilePictureUrl || null,
        logoUrl: logoUrl || null,
        heroLogoUrl: heroLogoUrl || null,
        socialInstagram: socialInstagram.trim() || null,
        socialYoutube: socialYoutube.trim() || null,
        socialSoundcloud: socialSoundcloud.trim() || null,
        storeTemplate: layout,
        playerStyle: player,
        bankIban: bankIban.trim() || null,
        bankAccountName: bankAccountName.trim() || null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <StudioLayout><div style={{ padding: "32px", color: "#888", fontFamily: F }}>Loading…</div></StudioLayout>;

  return (
    <StudioLayout>
      <div style={{ display: "flex", minHeight: "calc(100vh - 44px)", alignItems: "flex-start" }}>

        {/* ── Form column ── */}
        <div style={{ flex: "0 0 560px", maxWidth: "560px", padding: "32px 28px", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "6px" }}>
            <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>Store Design</h1>
            {slug && (
              <button onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/artists/${slug}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
              }} style={{
                display: "flex", alignItems: "center", gap: "6px",
                height: "34px", padding: "0 14px", borderRadius: "9999px",
                background: copied ? "#22C55E" : "#F5F5F5",
                border: `1px solid ${copied ? "#22C55E" : "#E5E5E5"}`,
                fontFamily: F, fontSize: "12px", fontWeight: 600,
                color: copied ? "#FFFFFF" : "#444",
                cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                transition: "all 0.25s ease",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {copied ? <polyline points="20 6 9 17 4 12"/> : <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>}
                </svg>
                {copied ? "Copied!" : "Copy shop link"}
              </button>
            )}
          </div>
          <p style={{ fontFamily: F, fontSize: "14px", color: "#888", marginBottom: "28px" }}>Set up your storefront — changes reflect in the preview.</p>

          {/* Identity */}
          <SectionCard>
            <SectionTitle>Your Identity</SectionTitle>
            <SectionSub>This is what visitors see on your store page.</SectionSub>
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <ImageUploadCard value={profilePictureUrl} onChange={setProfilePictureUrl} token={token} label="Profile picture" hint="Square, min 200×200" aspectRatio="1" circle />
              <div style={{ flex: 1, minWidth: "180px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "6px" }}>Display name</label>
                  <SInput value={displayName} onChange={setDisplayName} placeholder="Your producer name" />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "6px" }}>Bio</label>
                  <SInput value={bio} onChange={setBio} placeholder="Tell fans who you are…" textarea />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Logos */}
          <SectionCard>
            <SectionTitle>Shop Logos</SectionTitle>
            <SectionSub>Upload PNG logos for your shop header and hero section.</SectionSub>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <ImageUploadCard value={logoUrl} onChange={setLogoUrl} token={token} label="Header logo (PNG)" hint="Displayed centred in your shop's top navigation bar. Transparent PNG recommended." aspectRatio="4/1" acceptPng />
              {logoUrl && <button onClick={() => setLogoUrl("")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: "12px", color: "#AAA", padding: 0, textAlign: "left" }}>Remove logo</button>}
              <ImageUploadCard value={heroLogoUrl} onChange={setHeroLogoUrl} token={token} label="Hero logo (PNG)" hint="Large logo shown centred over your hero banner image. Transparent PNG recommended." aspectRatio="3/1" acceptPng />
              {heroLogoUrl && <button onClick={() => setHeroLogoUrl("")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: "12px", color: "#AAA", padding: 0, textAlign: "left" }}>Remove hero logo</button>}
            </div>
          </SectionCard>

          {/* Hero Image */}
          <SectionCard>
            <SectionTitle>Hero Image</SectionTitle>
            <SectionSub>Full-width banner in your store's hero section. Recommended 1400×400 px.</SectionSub>
            <ImageUploadCard value={bannerUrl} onChange={setBannerUrl} token={token} label="Banner image" hint="JPG, PNG or WebP · max 50 MB" aspectRatio="16/5" />
            {bannerUrl && <button onClick={() => setBannerUrl("")} style={{ marginTop: "10px", background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: "12px", color: "#AAA", padding: 0 }}>Remove image</button>}
          </SectionCard>

          {/* Social links */}
          <SectionCard>
            <SectionTitle>Social Links</SectionTitle>
            <SectionSub>Add your handles — just the username, not the full URL.</SectionSub>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Instagram", prefix: "instagram.com/", value: socialInstagram, set: setSocialInstagram, placeholder: "yourname" },
                { label: "YouTube",   prefix: "youtube.com/",   value: socialYoutube,   set: setSocialYoutube,   placeholder: "@channel" },
                { label: "SoundCloud",prefix: "soundcloud.com/",value: socialSoundcloud,set: setSocialSoundcloud,placeholder: "yourname" },
              ].map(({ label, prefix, value, set, placeholder }) => (
                <div key={label}>
                  <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "6px" }}>{label}</label>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #E5E5E5", borderRadius: "10px", overflow: "hidden", background: "#FFFFFF" }}
                    onFocusCapture={(e) => (e.currentTarget.style.borderColor = "#0A0A0A")}
                    onBlurCapture={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
                  >
                    <span style={{ padding: "0 10px", fontFamily: F, fontSize: "13px", color: "#AAA", whiteSpace: "nowrap", borderRight: "1px solid #E5E5E5", height: "40px", display: "flex", alignItems: "center" }}>{prefix}</span>
                    <input type="text" value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                      style={{ flex: 1, height: "40px", padding: "0 12px", border: "none", outline: "none", fontFamily: F, fontSize: "14px", background: "transparent" }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Colour Theme */}
          <SectionCard>
            <SectionTitle>Shop Colour Theme</SectionTitle>
            <SectionSub>Choose the background colour for your store page.</SectionSub>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {LAYOUTS.map((l) => (
                <button key={l.id} onClick={() => setLayout(l.id)} style={{
                  background: layout === l.id ? "#F0F0FF" : "#FAFAFA",
                  border: `2px solid ${layout === l.id ? "#0A0A0A" : "#E5E5E5"}`,
                  borderRadius: "12px", padding: "14px 10px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                  transition: "all 0.15s",
                }}>
                  <div style={{ width: "100%", height: "44px", background: l.bg, border: "1px solid #E5E5E5", borderRadius: "7px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ height: "12px", background: l.card, borderBottom: `1px solid ${l.border}` }} />
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px", padding: "3px" }}>
                      <div style={{ background: l.card, borderRadius: "2px" }} /><div style={{ background: l.card, borderRadius: "2px" }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: F, fontWeight: 600, fontSize: "13px", color: layout === l.id ? "#0A0A0A" : "#888" }}>{l.label}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* ── Beat Player Style ── */}
          <SectionCard>
            <SectionTitle>Beat Player Style</SectionTitle>
            <SectionSub>
              Choose how your beats are displayed on your store. Click a style to preview it live on the right.
            </SectionSub>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {PLAYERS.map((p) => {
                const active = player === p.id;
                return (
                  <button key={p.id} onClick={() => setPlayer(p.id)} style={{
                    background: active ? (p.id === "digital" ? "#0D0D1A" : "#F7F7FF") : "#FAFAFA",
                    border: `2px solid ${active ? (p.id === "digital" ? "#00FF41" : "#0A0A0A") : "#E5E5E5"}`,
                    borderRadius: "14px", padding: "14px",
                    cursor: "pointer", textAlign: "left", width: "100%",
                    transition: "all 0.15s",
                  }}>
                    {/* Label row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontFamily: F, fontWeight: 700, fontSize: "14px", color: active ? (p.id === "digital" ? "#00FF41" : "#0A0A0A") : "#444" }}>{p.label}</div>
                        <div style={{ fontFamily: F, fontSize: "12px", color: p.id === "digital" && active ? "#00AA30" : "#888", marginTop: "1px" }}>{p.desc}</div>
                      </div>
                      {/* Radio dot */}
                      <div style={{
                        width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${active ? (p.id === "digital" ? "#00FF41" : "#0A0A0A") : "#D4D4D4"}`,
                        background: active ? (p.id === "digital" ? "#00FF41" : "#0A0A0A") : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {active && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: p.id === "digital" ? "#0D0D1A" : "#FFFFFF" }} />}
                      </div>
                    </div>
                    {/* Full-width preview */}
                    <div style={{ width: "100%", pointerEvents: "none" }}>
                      <p.Preview />
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* Bank account */}
          <SectionCard>
            <SectionTitle>Bank Account for Payments</SectionTitle>
            <SectionSub>Buyers pay you directly via Czech QR bank transfer. Add your IBAN so a scannable QR code is automatically generated on every order.</SectionSub>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "6px" }}>IBAN</label>
                <SInput value={bankIban} onChange={setBankIban} placeholder="CZ65 0800 0000 1920 0014 5399" mono />
                <span style={{ fontFamily: F, fontSize: "11px", color: "#AAA", marginTop: "4px", display: "block" }}>Czech IBAN — found in your banking app under "Account details"</span>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "6px" }}>Account holder name</label>
                <SInput value={bankAccountName} onChange={setBankAccountName} placeholder="Jan Novák" />
              </div>
            </div>
          </SectionCard>

          <button onClick={handleSave} disabled={saving} style={{
            height: "46px", padding: "0 36px", borderRadius: "9999px",
            background: saved ? "#22C55E" : "#0A0A0A", color: "#FFFFFF", border: "none",
            fontFamily: F, fontWeight: 600, fontSize: "14px",
            cursor: saving ? "not-allowed" : "pointer",
            transition: "background 0.3s", opacity: saving ? 0.7 : 1,
            marginBottom: "40px",
          }}>
            {saved ? "✓ Saved!" : saving ? "Saving…" : "Save changes"}
          </button>
        </div>

        {/* ── Live Preview column ── */}
        <div style={{
          flex: 1, minWidth: 0,
          position: "sticky", top: "44px",
          height: "calc(100vh - 44px)",
          borderLeft: "1px solid #E5E5E5",
          background: "#F2F2F2",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: F, fontWeight: 600, fontSize: "13px", color: "#0A0A0A" }}>Live Preview</div>
              <div style={{ fontFamily: F, fontSize: "11px", color: "#888", marginTop: "1px" }}>Updates as you make changes · Click logo to test producer modal</div>
            </div>
            {slug && (
              <a href={`/artists/${slug}`} target="_blank" rel="noreferrer" style={{
                height: "28px", padding: "0 12px", borderRadius: "9999px",
                background: "#F5F5F5", border: "1px solid #E5E5E5",
                fontFamily: F, fontSize: "11px", fontWeight: 600, color: "#444",
                textDecoration: "none", display: "flex", alignItems: "center", gap: "5px", flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Open store
              </a>
            )}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
            <StorePreview
              displayName={displayName} bio={bio}
              bannerUrl={bannerUrl} profilePictureUrl={profilePictureUrl}
              logoUrl={logoUrl} heroLogoUrl={heroLogoUrl}
              socialInstagram={socialInstagram} socialYoutube={socialYoutube} socialSoundcloud={socialSoundcloud}
              layout={layout} player={player} slug={slug}
            />
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}

