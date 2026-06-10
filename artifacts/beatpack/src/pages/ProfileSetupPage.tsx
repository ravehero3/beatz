import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useAuthStore } from "@/store/authStore";
import ImageCropModal from "@/components/ImageCropModal";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";
import { Camera, Plus, X, Instagram, Youtube } from "lucide-react";

type UserType = "rapper" | "beatmaker" | "listener" | "label";

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const GENRES = ["Trap", "Drill", "Boom Bap", "Lo-fi", "R&B", "Afrobeats", "House", "Hip-hop", "Pop", "Reggae"];

interface ArtistSlot {
  name: string;
  avatarUrl: string;
}

const F = "'Figtree', sans-serif";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontFamily: F, fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "6px" }}>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, required, autoFocus, type }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type ?? "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      autoFocus={autoFocus}
      style={{
        width: "100%", height: "44px", padding: "0 14px",
        borderRadius: "10px", border: "1px solid #E5E5E5",
        fontFamily: F, fontSize: "14px", outline: "none",
        boxSizing: "border-box", transition: "border-color 0.15s ease",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
      onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%", padding: "12px 14px", borderRadius: "10px",
        border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px",
        outline: "none", boxSizing: "border-box", resize: "vertical",
        transition: "border-color 0.15s ease", lineHeight: 1.5,
      }}
      onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
      onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
    />
  );
}

function GenreSelect({ selected, onChange }: { selected: string[]; onChange: (g: string[]) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {GENRES.map((g) => {
        const active = selected.includes(g);
        return (
          <button
            key={g}
            type="button"
            onClick={() => onChange(active ? selected.filter((x) => x !== g) : [...selected, g])}
            style={{
              height: "30px", padding: "0 12px", borderRadius: "9999px",
              border: active ? "1.5px solid #0A0A0A" : "1px solid #E5E5E5",
              background: active ? "#0A0A0A" : "#FFFFFF",
              color: active ? "#FFFFFF" : "#444444",
              fontFamily: F, fontSize: "12px", fontWeight: 500, cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}

function AvatarButton({ avatarUrl, onClick }: { avatarUrl: string; onClick: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
      <button
        type="button"
        onClick={onClick}
        style={{
          width: "96px", height: "96px", borderRadius: "50%",
          background: avatarUrl ? "none" : "#F2F2F2",
          border: "2px dashed #D0D0D0", cursor: "pointer",
          overflow: "hidden", position: "relative", transition: "border-color 0.15s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0A0A0A"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "#D0D0D0"}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "4px" }}>
            <Camera size={20} color="#AAAAAA" />
            <span style={{ fontFamily: F, fontSize: "10px", color: "#AAAAAA" }}>Foto</span>
          </div>
        )}
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)",
          display: avatarUrl ? "flex" : "none", alignItems: "center", justifyContent: "center",
          opacity: 0, transition: "opacity 0.15s",
        }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}
        >
          <Camera size={20} color="#FFFFFF" />
        </div>
      </button>
    </div>
  );
}

function LabelArtistManagement({ slots, onChange }: { slots: ArtistSlot[]; onChange: (slots: ArtistSlot[]) => void }) {
  const [cropIndex, setCropIndex] = useState<number | null>(null);

  function updateSlot(i: number, partial: Partial<ArtistSlot>) {
    const next = slots.map((s, idx) => idx === i ? { ...s, ...partial } : s);
    onChange(next);
  }

  return (
    <div>
      <div style={{ fontFamily: F, fontSize: "13px", fontWeight: 600, color: "#0A0A0A", marginBottom: "4px" }}>
        Správa umělců labelu
      </div>
      <div style={{ fontFamily: F, fontSize: "12px", color: "#888888", marginBottom: "16px" }}>
        Přidej až 5 beat makerů pod svůj label
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {slots.map((slot, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "14px",
            background: "#F9F9F9", border: "1px solid #E8E8E8",
            borderRadius: "14px", padding: "14px 16px",
          }}>
            <button
              type="button"
              onClick={() => setCropIndex(i)}
              style={{
                width: "48px", height: "48px", flexShrink: 0, borderRadius: "50%",
                background: slot.avatarUrl ? "none" : "#EBEBEB",
                border: "1.5px dashed #C8C8C8", cursor: "pointer", overflow: "hidden",
              }}
            >
              {slot.avatarUrl ? (
                <img src={slot.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Plus size={18} color="#AAAAAA" style={{ margin: "auto", display: "block", marginTop: "13px" }} />
              )}
            </button>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={slot.name}
                onChange={(e) => updateSlot(i, { name: e.target.value })}
                placeholder={`Beat Maker ${i + 1}`}
                style={{
                  width: "100%", height: "36px", padding: "0 12px",
                  borderRadius: "8px", border: "1px solid #E5E5E5",
                  fontFamily: F, fontSize: "13px", outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>
            {(slot.name || slot.avatarUrl) && (
              <button
                type="button"
                onClick={() => updateSlot(i, { name: "", avatarUrl: "" })}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#CCCCCC" }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      {cropIndex !== null && (
        <ImageCropModal
          onSave={(url) => { updateSlot(cropIndex, { avatarUrl: url }); setCropIndex(null); }}
          onClose={() => setCropIndex(null)}
          initialUrl={slots[cropIndex]?.avatarUrl}
        />
      )}
    </div>
  );
}

export default function ProfileSetupPage() {
  const params = useParams<{ type: string }>();
  const type = (params.type ?? "listener") as UserType;
  const { user, token, setAuth, setUserType } = useAuthStore();
  const [, setLocation] = useLocation();

  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [soundcloud, setSoundcloud] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [artistSlots, setArtistSlots] = useState<ArtistSlot[]>(
    Array.from({ length: 5 }, () => ({ name: "", avatarUrl: "" }))
  );
  const [showCrop, setShowCrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const config: Record<UserType, { nameLabel: string; namePlaceholder: string; nameSub: string; }> = {
    rapper: { nameLabel: "Jméno umělce / Artist Name", namePlaceholder: "např. Young Novák", nameSub: "Rapper" },
    beatmaker: { nameLabel: "Jméno beat makera / Beat Maker Name", namePlaceholder: "např. ProducerX", nameSub: "Beat Maker" },
    listener: { nameLabel: "Přezdívka / Nickname", namePlaceholder: "např. MusicFan99", nameSub: "Posluchač" },
    label: { nameLabel: "Jméno labelu / Label Name", namePlaceholder: "např. Nova Records", nameSub: "Label" },
  };
  const cfg = config[type];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) { setError("Jméno je povinné."); return; }
    setError("");
    setLoading(true);

    try {
      if (type === "beatmaker") {
        const res = await fetch("/api/auth/become-artist", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ displayName: displayName.trim() }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Něco se pokazilo."); setLoading(false); return; }
        setAuth(data.user, data.token);
        setUserType("beatmaker");
        setLocation("/studio");
      } else {
        setUserType(type);
        setLocation(type === "listener" ? "/beats" : "/");
      }
    } catch {
      setError("Něco se pokazilo. Zkuste to znovu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F9F9F9", padding: "24px", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "48px" }}>
      <div style={{
        background: "#FFFFFF", border: "1px solid #E5E5E5",
        borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "500px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.07)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src={beatpackLogo} alt="beatpack" style={{ height: "20px", marginBottom: "24px" }} />
          <div style={{ fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#888888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
            {cfg.nameSub}
          </div>
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            Nastav si profil
          </h1>
          <p style={{ fontFamily: F, fontSize: "14px", color: "#888888" }}>
            Toto je tvůj veřejný profil. Můžeš ho kdykoli upravit.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <AvatarButton avatarUrl={avatarUrl} onClick={() => setShowCrop(true)} />

          <div>
            <FieldLabel>{cfg.nameLabel}</FieldLabel>
            <TextInput value={displayName} onChange={setDisplayName} placeholder={cfg.namePlaceholder} required />
            {type === "beatmaker" && displayName && (
              <div style={{ marginTop: "6px", fontFamily: F, fontSize: "12px", color: "#888888" }}>
                Tvůj store: <strong>beatpack.cz/artists/{slugify(displayName)}</strong>
              </div>
            )}
          </div>

          {type !== "listener" && (
            <div>
              <FieldLabel>Bio / Popis</FieldLabel>
              <TextArea value={bio} onChange={setBio} placeholder="Řekni ostatním o sobě..." rows={3} />
            </div>
          )}

          {(type === "rapper" || type === "listener") && (
            <div>
              <FieldLabel>Město / City</FieldLabel>
              <TextInput value={city} onChange={setCity} placeholder="Praha, Brno..." />
            </div>
          )}

          <div>
            <FieldLabel>Oblíbené žánry</FieldLabel>
            <GenreSelect selected={genres} onChange={setGenres} />
          </div>

          {(type === "rapper" || type === "beatmaker" || type === "label") && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <FieldLabel>Sociální sítě (volitelné)</FieldLabel>
              <div style={{ position: "relative" }}>
                <Instagram size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#AAAAAA" }} />
                <input
                  type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                  placeholder="instagram.com/tvojeméno"
                  style={{ width: "100%", height: "40px", padding: "0 14px 0 36px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
                />
              </div>
              <div style={{ position: "relative" }}>
                <Youtube size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#AAAAAA" }} />
                <input
                  type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)}
                  placeholder="youtube.com/@kanal"
                  style={{ width: "100%", height: "40px", padding: "0 14px 0 36px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
                />
              </div>
            </div>
          )}

          {type === "label" && (
            <LabelArtistManagement slots={artistSlots} onChange={setArtistSlots} />
          )}

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 12px", fontFamily: F, fontSize: "13px", color: "#EF4444" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
            <button
              type="button"
              onClick={() => setLocation("/")}
              style={{
                flex: "0 0 auto", height: "44px", padding: "0 20px", borderRadius: "9999px",
                border: "1px solid #E5E5E5", background: "#FFFFFF",
                fontFamily: F, fontSize: "14px", fontWeight: 500, color: "#888888", cursor: "pointer",
              }}
            >
              Přeskočit
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, height: "44px", borderRadius: "9999px",
                border: "none", background: "#0A0A0A",
                fontFamily: F, fontSize: "14px", fontWeight: 500, color: "#FFFFFF",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Ukládám..." : "Dokončit nastavení"}
            </button>
          </div>
        </form>
      </div>

      {showCrop && (
        <ImageCropModal
          onSave={(url) => { setAvatarUrl(url); setShowCrop(false); }}
          onClose={() => setShowCrop(false)}
          initialUrl={avatarUrl}
        />
      )}
    </div>
  );
}
