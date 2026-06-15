import { useState, useEffect } from "react";
import { useGetMyArtistProfile, useUpdateMyArtistProfile, getGetMyArtistProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import StudioLayout from "./StudioLayout";
import { useT } from "@/lib/i18n";
import { CheckCircle2, AlertCircle, User, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const F = "'Figtree', sans-serif";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: F, fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "5px" }}>{label}</label>
      {children}
      {hint && <p style={{ fontFamily: F, fontSize: "11px", color: "#AAAAAA", marginTop: "4px" }}>{hint}</p>}
    </div>
  );
}

function SInput({ value, onChange, placeholder, disabled }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        width: "100%", height: "42px", padding: "0 12px", borderRadius: "10px",
        border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none",
        boxSizing: "border-box", background: disabled ? "#F9F9F9" : "#FFFFFF",
        color: disabled ? "#888888" : "#0A0A0A",
      }}
      onFocus={(e) => { if (!disabled) e.target.style.borderColor = "#0A0A0A"; }}
      onBlur={(e) => { e.target.style.borderColor = "#E5E5E5"; }}
    />
  );
}

function STextarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", padding: "10px 12px", borderRadius: "10px",
        border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none",
        boxSizing: "border-box", resize: "vertical", lineHeight: 1.55,
      }}
      onFocus={(e) => { e.target.style.borderColor = "#0A0A0A"; }}
      onBlur={(e) => { e.target.style.borderColor = "#E5E5E5"; }}
    />
  );
}

export default function StudioProfilePage() {
  const t = useT();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { data: artist, isLoading } = useGetMyArtistProfile();
  const updateProfile = useUpdateMyArtistProfile();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [soundcloud, setSoundcloud] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (artist) {
      setDisplayName(artist.displayName ?? "");
      setBio(artist.bio ?? "");
      setInstagram(artist.socialInstagram ?? "");
      setYoutube(artist.socialYoutube ?? "");
      setSoundcloud(artist.socialSoundcloud ?? "");
    }
  }, [artist]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    updateProfile.mutate(
      {
        data: {
          displayName: displayName.trim() || undefined,
          bio: bio.trim() || null,
          socialInstagram: instagram.trim() || null,
          socialYoutube: youtube.trim() || null,
          socialSoundcloud: soundcloud.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setMsg({ text: t("profile.saved"), ok: true });
          queryClient.invalidateQueries({ queryKey: getGetMyArtistProfileQueryKey() });
        },
        onError: () => setMsg({ text: t("profile.error"), ok: false }),
      }
    );
  }

  if (isLoading) {
    return (
      <StudioLayout>
        <div style={{ padding: "32px" }}>
          <div style={{ height: "24px", width: "200px", background: "#F2F2F2", borderRadius: "8px", marginBottom: "28px" }} />
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: "80px", background: "#F2F2F2", borderRadius: "12px", marginBottom: "16px" }} />
          ))}
        </div>
      </StudioLayout>
    );
  }

  return (
    <StudioLayout>
      <div style={{ padding: "32px", maxWidth: "600px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>
            {t("studio.nav.profile")}
          </h1>
          {artist?.slug && (
            <a
              href={`/artists/${artist.slug}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: F, fontSize: "13px", color: "#888888", textDecoration: "none" }}
            >
              {t("profile.viewStore")} <ExternalLink size={12} />
            </a>
          )}
        </div>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Identity */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={16} color="#444" />
              </div>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: "16px", color: "#0A0A0A" }}>{t("profile.identity")}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label={t("profile.displayName")}>
                <SInput value={displayName} onChange={setDisplayName} placeholder="DJ Novák" />
              </Field>

              <Field label={t("profile.bio")} hint={t("profile.bioHint")}>
                <STextarea value={bio} onChange={setBio} placeholder={t("profile.bioPlaceholder")} rows={4} />
              </Field>

              <Field label={t("profile.slug")} hint={`beatpack.cz/artists/${artist?.slug ?? "vas-obchod"}`}>
                <SInput value={artist?.slug ?? ""} disabled />
              </Field>
            </div>
          </div>

          {/* Social links */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "16px" }}>
              {t("profile.social")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Instagram">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: F, fontSize: "14px", color: "#888888", background: "#F9F9F9", border: "1px solid #E5E5E5", borderRight: "none", borderRadius: "10px 0 0 10px", padding: "0 10px", height: "42px", display: "flex", alignItems: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
                    instagram.com/
                  </span>
                  <input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="username"
                    style={{ flex: 1, height: "42px", padding: "0 12px", borderRadius: "0 10px 10px 0", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => { e.target.style.borderColor = "#0A0A0A"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E5E5E5"; }}
                  />
                </div>
              </Field>

              <Field label="YouTube">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: F, fontSize: "14px", color: "#888888", background: "#F9F9F9", border: "1px solid #E5E5E5", borderRight: "none", borderRadius: "10px 0 0 10px", padding: "0 10px", height: "42px", display: "flex", alignItems: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
                    youtube.com/
                  </span>
                  <input
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="@channel"
                    style={{ flex: 1, height: "42px", padding: "0 12px", borderRadius: "0 10px 10px 0", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => { e.target.style.borderColor = "#0A0A0A"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E5E5E5"; }}
                  />
                </div>
              </Field>

              <Field label="SoundCloud">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: F, fontSize: "14px", color: "#888888", background: "#F9F9F9", border: "1px solid #E5E5E5", borderRight: "none", borderRadius: "10px 0 0 10px", padding: "0 10px", height: "42px", display: "flex", alignItems: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
                    soundcloud.com/
                  </span>
                  <input
                    value={soundcloud}
                    onChange={(e) => setSoundcloud(e.target.value)}
                    placeholder="username"
                    style={{ flex: 1, height: "42px", padding: "0 12px", borderRadius: "0 10px 10px 0", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => { e.target.style.borderColor = "#0A0A0A"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E5E5E5"; }}
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Save */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              type="submit"
              disabled={updateProfile.isPending}
              style={{
                height: "42px", padding: "0 28px", borderRadius: "9999px",
                background: "#0A0A0A", color: "#FFFFFF", border: "none",
                fontFamily: F, fontSize: "14px", fontWeight: 600,
                cursor: updateProfile.isPending ? "not-allowed" : "pointer",
                opacity: updateProfile.isPending ? 0.6 : 1,
              }}
            >
              {updateProfile.isPending ? t("profile.saving") : t("profile.save")}
            </button>

            {msg && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 12px", background: msg.ok ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${msg.ok ? "#86EFAC" : "#FECACA"}`, borderRadius: "9999px" }}>
                {msg.ok ? <CheckCircle2 size={13} color="#22C55E" /> : <AlertCircle size={13} color="#EF4444" />}
                <span style={{ fontFamily: F, fontSize: "12px", fontWeight: 500, color: msg.ok ? "#22C55E" : "#EF4444" }}>{msg.text}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </StudioLayout>
  );
}
