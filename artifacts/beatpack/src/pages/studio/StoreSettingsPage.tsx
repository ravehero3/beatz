import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import StudioLayout from "./StudioLayout";
import { Upload } from "lucide-react";

const LAYOUTS = [
  { id: "light", label: "Light", bg: "#FFFFFF", text: "#0A0A0A", muted: "#888888", card: "#F9F9F9", border: "#E5E5E5", preview: ["#FFFFFF", "#F5F5F5", "#E5E5E5"] },
  { id: "grey",  label: "Grey",  bg: "#F5F5F5", text: "#0A0A0A", muted: "#666666", card: "#FFFFFF", border: "#E0E0E0", preview: ["#F5F5F5", "#EBEBEB", "#D4D4D4"] },
  { id: "dark",  label: "Dark",  bg: "#0A0A0A", text: "#FFFFFF", muted: "#888888", card: "#141414", border: "#1F1F1F", preview: ["#0A0A0A", "#141414", "#1F1F1F"] },
];

const PLAYERS = [
  {
    id: "classic",
    label: "Classic",
    desc: "Square cover art with waveform below",
    preview: (
      <div style={{ padding: "10px", background: "#F9F9F9", borderRadius: "8px" }}>
        <div style={{ width: "100%", aspectRatio: "1", background: "#E5E5E5", borderRadius: "6px", marginBottom: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAAAAA", fontSize: "20px" }}>♪</div>
        <div style={{ fontWeight: 700, color: "#0A0A0A", marginBottom: "4px", fontSize: "11px", fontFamily: "'Figtree', sans-serif" }}>Beat Title</div>
        <div style={{ display: "flex", gap: "2px", marginBottom: "6px" }}>
          {[40, 60, 45, 80, 55, 70, 35, 65, 50, 75, 45, 60].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h * 0.2}px`, background: i < 5 ? "#0A0A0A" : "#E5E5E5", borderRadius: "1px" }} />
          ))}
        </div>
        <div style={{ height: "22px", background: "#0A0A0A", borderRadius: "11px" }} />
      </div>
    ),
  },
  {
    id: "minimal",
    label: "Minimal",
    desc: "Compact rows with inline waveform",
    preview: (
      <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F9F9F9", padding: "6px 8px", borderRadius: "8px" }}>
            <div style={{ width: "28px", height: "28px", background: "#E5E5E5", borderRadius: "4px", flexShrink: 0 }} />
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "1.5px solid #E5E5E5", flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", gap: "1px", alignItems: "center" }}>
              {[30, 60, 45, 80, 55, 70, 35, 65, 50, 75, 45, 60, 40, 70, 55, 65].map((h, j) => (
                <div key={j} style={{ flex: 1, height: `${h * 0.18}px`, background: j < 6 ? "#0A0A0A" : "#E5E5E5", borderRadius: "1px" }} />
              ))}
            </div>
            <div style={{ width: "32px", height: "18px", background: "#0A0A0A", borderRadius: "9px", flexShrink: 0 }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "deck",
    label: "Deck",
    desc: "Wide DJ-style cards with large waveform",
    preview: (
      <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {[1, 2].map((i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr", background: "#F9F9F9", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ background: "#E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#AAAAAA" }}>♪</div>
            <div style={{ padding: "6px 8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ height: "8px", width: "60%", background: "#0A0A0A", borderRadius: "4px" }} />
                <div style={{ height: "16px", width: "30%", background: "#0A0A0A", borderRadius: "8px" }} />
              </div>
              <div style={{ display: "flex", gap: "1px", alignItems: "center", marginBottom: "2px" }}>
                {[30, 60, 45, 80, 55, 70, 35, 65, 50, 75, 45, 60, 40, 70, 55, 65, 45, 80, 55, 70].map((h, j) => (
                  <div key={j} style={{ flex: 1, height: `${h * 0.14}px`, background: j < 8 ? "#A78BFA" : "#333", borderRadius: "1px" }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const F = "'Figtree', sans-serif";

function SInput({ value, onChange, placeholder, type = "text", mono, textarea }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; mono?: boolean; textarea?: boolean;
}) {
  const base: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: "10px",
    border: "1px solid #E5E5E5", fontFamily: mono ? "'Courier New', monospace" : F,
    fontSize: "14px", outline: "none", boxSizing: "border-box", background: "#FFFFFF",
    resize: "vertical",
  };
  if (textarea) {
    return (
      <textarea
        value={value}
        placeholder={placeholder}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...base, height: "auto" }}
        onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
        onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
      />
    );
  }
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...base, height: "40px" }}
      onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
      onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
    />
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
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } finally {
      setUploading(false);
    }
  }

  const size = circle ? "96px" : "100%";

  return (
    <div>
      <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "8px" }}>{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          width: size,
          aspectRatio: circle ? "1" : aspectRatio,
          borderRadius: circle ? "50%" : "12px",
          border: value ? "none" : "2px dashed #E5E5E5",
          overflow: "hidden", cursor: "pointer", position: "relative",
          background: value ? "transparent" : "#F9F9F9",
          transition: "border-color 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {value && (
          <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: circle ? "cover" : "contain", display: "block" }} />
        )}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
          background: value ? (hovering ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)") : "transparent",
          transition: "background 0.2s",
          pointerEvents: "none",
          padding: circle ? "8px" : "12px",
        }}>
          {(!value || hovering) && (
            <>
              {uploading
                ? <div style={{ fontFamily: F, fontSize: "11px", color: value ? "#fff" : "#AAAAAA", textAlign: "center" }}>Uploading…</div>
                : <>
                  <Upload size={circle ? 16 : 18} color={value ? "#fff" : "#AAAAAA"} />
                  <div style={{ fontFamily: F, fontSize: "11px", color: value ? "#fff" : "#AAAAAA", textAlign: "center", lineHeight: 1.3 }}>
                    {value ? "Change" : "Click to upload"}
                  </div>
                </>
              }
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={acceptPng ? "image/png" : "image/jpeg,image/png,image/webp,image/gif"}
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
      </div>
      {hint && <p style={{ fontFamily: F, fontSize: "11px", color: "#AAAAAA", marginTop: "6px" }}>{hint}</p>}
    </div>
  );
}

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: F, fontWeight: 700, fontSize: "15px", color: "#0A0A0A", letterSpacing: "-0.01em", marginBottom: "4px" }}>
    {children}
  </div>
);

const SectionSub = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontFamily: F, fontSize: "13px", color: "#888888", marginBottom: "16px", lineHeight: 1.6 }}>{children}</p>
);

function StorePreview({
  displayName, bio, bannerUrl, profilePictureUrl, logoUrl, heroLogoUrl,
  socialInstagram, socialYoutube, socialSoundcloud, layout, player,
}: {
  displayName: string; bio: string; bannerUrl: string; profilePictureUrl: string;
  logoUrl: string; heroLogoUrl: string;
  socialInstagram: string; socialYoutube: string; socialSoundcloud: string;
  layout: string; player: string;
}) {
  const theme = LAYOUTS.find((l) => l.id === layout) ?? LAYOUTS[0];
  const isDark = layout === "dark";
  const socialIconColor = theme.text;
  const socialIconBorder = isDark ? "#333333" : "#E5E5E5";

  const fakeBeat = { title: "Sample Beat", bpm: 140, genre: "Trap" };

  function BeatCard() {
    if (player === "minimal") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: theme.card, borderRadius: "10px", padding: "8px 10px", border: `1px solid ${theme.border}` }}>
          <div style={{ width: "32px", height: "32px", background: theme.border, borderRadius: "6px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: theme.muted, fontSize: "12px" }}>♪</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: theme.text, marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fakeBeat.title}</div>
            <div style={{ display: "flex", gap: "1px", alignItems: "center" }}>
              {[30, 60, 45, 80, 55, 70, 35, 65, 50, 75, 45, 60].map((h, j) => (
                <div key={j} style={{ flex: 1, height: `${h * 0.12}px`, background: j < 5 ? theme.text : theme.border, borderRadius: "1px" }} />
              ))}
            </div>
          </div>
          <div style={{ width: "36px", height: "18px", background: theme.text, borderRadius: "9px", flexShrink: 0 }} />
        </div>
      );
    }
    if (player === "deck") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "48px 1fr", background: theme.card, borderRadius: "10px", overflow: "hidden", border: `1px solid ${theme.border}` }}>
          <div style={{ background: theme.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: theme.muted }}>♪</div>
          <div style={{ padding: "8px 10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <div style={{ fontFamily: F, fontSize: "11px", fontWeight: 700, color: theme.text }}>{fakeBeat.title}</div>
              <div style={{ height: "16px", width: "36px", background: theme.text, borderRadius: "8px" }} />
            </div>
            <div style={{ display: "flex", gap: "1px", alignItems: "center" }}>
              {[30, 60, 45, 80, 55, 70, 35, 65, 50, 75, 45, 60, 40, 70].map((h, j) => (
                <div key={j} style={{ flex: 1, height: `${h * 0.1}px`, background: j < 6 ? (isDark ? "#A78BFA" : theme.text) : theme.border, borderRadius: "1px" }} />
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{ background: theme.card, borderRadius: "10px", overflow: "hidden", border: `1px solid ${theme.border}` }}>
        <div style={{ width: "100%", aspectRatio: "1", background: theme.border, display: "flex", alignItems: "center", justifyContent: "center", color: theme.muted, fontSize: "22px" }}>♪</div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontFamily: F, fontSize: "11px", fontWeight: 700, color: theme.text, marginBottom: "4px" }}>{fakeBeat.title}</div>
          <div style={{ display: "flex", gap: "1px", marginBottom: "6px" }}>
            {[40, 60, 45, 80, 55, 70, 35, 65, 50, 75, 45, 60].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h * 0.18}px`, background: i < 5 ? theme.text : theme.border, borderRadius: "1px" }} />
            ))}
          </div>
          <div style={{ height: "20px", background: theme.text, borderRadius: "10px" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: theme.bg,
      borderRadius: "16px",
      overflow: "hidden",
      border: `1px solid ${isDark ? "#2A2A2A" : "#E5E5E5"}`,
      fontFamily: F,
    }}>
      {/* Mini nav */}
      <div style={{
        height: "32px", background: theme.card,
        borderBottom: `1px solid ${theme.border}`,
        display: "flex", alignItems: "center", padding: "0 12px", gap: "8px",
      }}>
        {logoUrl
          ? <img src={logoUrl} alt="" style={{ height: "14px", objectFit: "contain", maxWidth: "60px" }} />
          : <div style={{ fontFamily: F, fontSize: "11px", fontWeight: 700, color: theme.text }}>beatpack</div>
        }
        <div style={{ flex: 1 }} />
        <div style={{ width: "28px", height: "10px", background: theme.border, borderRadius: "5px" }} />
        <div style={{ width: "36px", height: "16px", background: theme.text, borderRadius: "8px" }} />
      </div>

      {/* Banner */}
      <div style={{
        height: "70px",
        background: bannerUrl ? `url(${bannerUrl}) center/cover` : (isDark ? "#111111" : "#F0F0F0"),
      }} />

      {/* Artist header */}
      <div style={{ padding: "0 14px", marginTop: "-20px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: isDark ? "#1F1F1F" : "#FFFFFF",
            border: `3px solid ${theme.bg}`,
            overflow: "hidden", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
            {profilePictureUrl
              ? <img src={profilePictureUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: "16px" }}>♪</span>
            }
          </div>
          <div style={{ paddingBottom: "4px", flex: 1 }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: "13px", color: theme.text }}>{displayName || "Your Name"}</div>
            {bio && <div style={{ fontFamily: F, fontSize: "10px", color: theme.muted, marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>{bio}</div>}
            <div style={{ display: "flex", gap: "5px", marginTop: "4px" }}>
              {socialInstagram && (
                <div style={{ width: "18px", height: "18px", borderRadius: "5px", border: `1px solid ${socialIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={socialIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </div>
              )}
              {socialYoutube && (
                <div style={{ width: "18px", height: "18px", borderRadius: "5px", border: `1px solid ${socialIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill={socialIconColor}><path d="M23 7s-.3-2-1.2-2.7c-1.1-1.2-2.4-1.2-3-1.3C16.2 3 12 3 12 3s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.3.3 4.3s.3 2 1.2 2.7c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.7 12 21.7 12 21.7s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2.1.3-4.3v-2C23.3 9.1 23 7 23 7zm-13.5 8.5v-7.4l8.1 3.7-8.1 3.7z"/></svg>
                </div>
              )}
              {socialSoundcloud && (
                <div style={{ width: "18px", height: "18px", borderRadius: "5px", border: `1px solid ${socialIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill={socialIconColor}><path d="M1.175 12.225c-.015 0-.032.002-.047.002-.576 0-1.043-.468-1.043-1.045 0-.576.467-1.044 1.043-1.044.016 0 .032.002.047.003C1.59 8.152 3.51 6.5 5.802 6.5c.413 0 .81.056 1.188.16C7.72 5.5 8.993 4.5 10.5 4.5c2.209 0 4 1.79 4 4 0 .075-.002.15-.007.225C15.437 8.875 16.5 9.875 16.5 11c0 1.105-.895 2-2 2H1.175zm20.35 0H18v.001c-.5 0-.9-.4-.9-.9s.4-.9.9-.9h.08C18.24 9.375 19.08 8.5 20.1 8.5c.12 0 .24.012.355.035C20.78 7.625 21.6 7 22.575 7 23.91 7 25 8.09 25 9.425c0 .08-.005.158-.013.236.38.215.613.617.613 1.064 0 .704-.57 1.275-1.275 1.275-.235 0-.455-.064-.638-.175V12.225z"/></svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero logo above beats */}
      {heroLogoUrl && (
        <div style={{ padding: "0 14px", marginBottom: "10px" }}>
          <img src={heroLogoUrl} alt="" style={{ height: "28px", objectFit: "contain", maxWidth: "140px" }} />
        </div>
      )}

      {/* Beats list */}
      <div style={{ padding: "0 14px 14px" }}>
        <div style={{ borderBottom: `1px solid ${theme.border}`, marginBottom: "10px", display: "flex", gap: "12px" }}>
          {["All Beats", "Popular"].map((t, i) => (
            <div key={t} style={{ fontFamily: F, fontSize: "10px", fontWeight: i === 0 ? 600 : 400, color: i === 0 ? theme.text : theme.muted, borderBottom: i === 0 ? `2px solid ${theme.text}` : "2px solid transparent", paddingBottom: "6px" }}>{t}</div>
          ))}
        </div>
        {player === "classic" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <BeatCard /><BeatCard />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <BeatCard /><BeatCard />
          </div>
        )}
      </div>
    </div>
  );
}

export default function StoreSettingsPage() {
  const { token } = useAuthStore();

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
  const [player, setPlayer] = useState("classic");
  const [bankIban, setBankIban] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/artists/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.displayName) setDisplayName(data.displayName);
        if (data.bio) setBio(data.bio);
        if (data.bannerUrl) setBannerUrl(data.bannerUrl);
        if (data.profilePictureUrl) setProfilePictureUrl(data.profilePictureUrl);
        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.heroLogoUrl) setHeroLogoUrl(data.heroLogoUrl);
        if (data.socialInstagram) setSocialInstagram(data.socialInstagram);
        if (data.socialYoutube) setSocialYoutube(data.socialYoutube);
        if (data.socialSoundcloud) setSocialSoundcloud(data.socialSoundcloud);
        if (data.storeTemplate) setLayout(data.storeTemplate);
        if (data.playerStyle) setPlayer(data.playerStyle);
        if (data.bankIban) setBankIban(data.bankIban);
        if (data.bankAccountName) setBankAccountName(data.bankAccountName);
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
        {/* Form column */}
        <div style={{ flex: "0 0 560px", maxWidth: "560px", padding: "32px 28px", overflowY: "auto" }}>
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "6px" }}>Store Design</h1>
          <p style={{ fontFamily: F, fontSize: "14px", color: "#888888", marginBottom: "28px" }}>
            Set up your storefront — changes reflect in the preview.
          </p>

          {/* Identity */}
          <SectionCard>
            <SectionTitle>Your Identity</SectionTitle>
            <SectionSub>This is what visitors see on your store page.</SectionSub>
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <ImageUploadCard
                value={profilePictureUrl}
                onChange={setProfilePictureUrl}
                token={token}
                label="Profile picture"
                hint="Square, min 200×200"
                aspectRatio="1"
                circle
              />
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
              <ImageUploadCard
                value={logoUrl}
                onChange={setLogoUrl}
                token={token}
                label="Header logo (PNG)"
                hint="Displayed in your shop's top navigation bar. Transparent PNG recommended."
                aspectRatio="4/1"
                acceptPng
              />
              {logoUrl && (
                <button onClick={() => setLogoUrl("")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: "12px", color: "#AAAAAA", padding: 0, textAlign: "left" }}>
                  Remove logo
                </button>
              )}
              <ImageUploadCard
                value={heroLogoUrl}
                onChange={setHeroLogoUrl}
                token={token}
                label="Hero logo (PNG)"
                hint="Large logo shown above your beat playlist in the hero section. Transparent PNG recommended."
                aspectRatio="3/1"
                acceptPng
              />
              {heroLogoUrl && (
                <button onClick={() => setHeroLogoUrl("")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: "12px", color: "#AAAAAA", padding: 0, textAlign: "left" }}>
                  Remove hero logo
                </button>
              )}
            </div>
          </SectionCard>

          {/* Hero image */}
          <SectionCard>
            <SectionTitle>Hero Image</SectionTitle>
            <SectionSub>This banner appears at the top of your store page. Use a wide image (recommended 1400×400 px).</SectionSub>
            <ImageUploadCard
              value={bannerUrl}
              onChange={setBannerUrl}
              token={token}
              label="Banner image"
              hint="JPG, PNG or WebP · max 50 MB"
              aspectRatio="16/5"
            />
            {bannerUrl && (
              <button
                onClick={() => setBannerUrl("")}
                style={{ marginTop: "10px", background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: "12px", color: "#AAAAAA", padding: 0 }}
              >
                Remove image
              </button>
            )}
          </SectionCard>

          {/* Social links */}
          <SectionCard>
            <SectionTitle>Social Links</SectionTitle>
            <SectionSub>Add your handles — just the username, not the full URL.</SectionSub>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Instagram", prefix: "instagram.com/", value: socialInstagram, set: setSocialInstagram, placeholder: "yourname" },
                { label: "YouTube", prefix: "youtube.com/", value: socialYoutube, set: setSocialYoutube, placeholder: "@channel" },
                { label: "SoundCloud", prefix: "soundcloud.com/", value: socialSoundcloud, set: setSocialSoundcloud, placeholder: "yourname" },
              ].map(({ label, prefix, value, set, placeholder }) => (
                <div key={label}>
                  <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "6px" }}>{label}</label>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #E5E5E5", borderRadius: "10px", overflow: "hidden", background: "#FFFFFF", transition: "border-color 0.15s" }}
                    onFocusCapture={(e) => (e.currentTarget.style.borderColor = "#0A0A0A")}
                    onBlurCapture={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
                  >
                    <span style={{ padding: "0 10px", fontFamily: F, fontSize: "13px", color: "#AAAAAA", whiteSpace: "nowrap", borderRight: "1px solid #E5E5E5", height: "40px", display: "flex", alignItems: "center" }}>
                      {prefix}
                    </span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                      style={{ flex: 1, height: "40px", padding: "0 12px", border: "none", outline: "none", fontFamily: F, fontSize: "14px", background: "transparent" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Layout */}
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
                  transition: "all 0.15s ease",
                }}>
                  <div style={{ width: "100%", height: "60px", background: l.preview[0], border: "1px solid #E5E5E5", borderRadius: "8px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ height: "14px", background: l.preview[1], borderBottom: `1px solid ${l.preview[2]}` }} />
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", padding: "4px" }}>
                      <div style={{ background: l.preview[1], borderRadius: "3px" }} />
                      <div style={{ background: l.preview[1], borderRadius: "3px" }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: F, fontWeight: 600, fontSize: "13px", color: layout === l.id ? "#0A0A0A" : "#888888" }}>{l.label}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Player */}
          <SectionCard>
            <SectionTitle>Beat Player Style</SectionTitle>
            <SectionSub>Choose how your beats are displayed on your store.</SectionSub>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {PLAYERS.map((p) => (
                <button key={p.id} onClick={() => setPlayer(p.id)} style={{
                  background: player === p.id ? "#F0F0FF" : "#FAFAFA",
                  border: `2px solid ${player === p.id ? "#0A0A0A" : "#E5E5E5"}`,
                  borderRadius: "12px", padding: "12px", cursor: "pointer",
                  display: "flex", flexDirection: "column", gap: "10px",
                  transition: "all 0.15s ease", textAlign: "left",
                }}>
                  <div style={{ width: "100%", pointerEvents: "none" }}>{p.preview}</div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 700, fontSize: "13px", color: player === p.id ? "#0A0A0A" : "#444444" }}>{p.label}</div>
                    <div style={{ fontFamily: F, fontSize: "11px", color: "#888888", marginTop: "2px" }}>{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Bank account */}
          <SectionCard>
            <SectionTitle>Bank Account for Payments</SectionTitle>
            <SectionSub>
              Buyers pay you directly via Czech QR bank transfer. Add your IBAN so a scannable QR code is automatically generated on every order.
            </SectionSub>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "6px" }}>IBAN</label>
                <SInput value={bankIban} onChange={setBankIban} placeholder="CZ65 0800 0000 1920 0014 5399" mono />
                <span style={{ fontFamily: F, fontSize: "11px", color: "#AAAAAA", marginTop: "4px", display: "block" }}>Czech IBAN — found in your banking app under "Account details"</span>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "6px" }}>Account holder name</label>
                <SInput value={bankAccountName} onChange={setBankAccountName} placeholder="Jan Novák" />
              </div>
            </div>
          </SectionCard>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              height: "46px", padding: "0 36px", borderRadius: "9999px",
              background: saved ? "#22C55E" : "#0A0A0A", color: "#FFFFFF", border: "none",
              fontFamily: F, fontWeight: 600, fontSize: "14px",
              cursor: saving ? "not-allowed" : "pointer",
              transition: "background 0.3s ease", opacity: saving ? 0.7 : 1,
              marginBottom: "40px",
            }}
          >
            {saved ? "✓ Saved!" : saving ? "Saving…" : "Save changes"}
          </button>
        </div>

        {/* Preview column */}
        <div style={{
          flex: 1,
          minWidth: 0,
          position: "sticky",
          top: "44px",
          height: "calc(100vh - 44px)",
          borderLeft: "1px solid #E5E5E5",
          background: "#F2F2F2",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E5E5", background: "#FFFFFF" }}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "13px", color: "#0A0A0A" }}>Live Preview</div>
            <div style={{ fontFamily: F, fontSize: "11px", color: "#888888", marginTop: "2px" }}>Updates as you make changes</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
            <StorePreview
              displayName={displayName}
              bio={bio}
              bannerUrl={bannerUrl}
              profilePictureUrl={profilePictureUrl}
              logoUrl={logoUrl}
              heroLogoUrl={heroLogoUrl}
              socialInstagram={socialInstagram}
              socialYoutube={socialYoutube}
              socialSoundcloud={socialSoundcloud}
              layout={layout}
              player={player}
            />
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}
