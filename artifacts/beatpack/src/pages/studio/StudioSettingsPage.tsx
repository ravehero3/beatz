import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUpdateMyProfile } from "@workspace/api-client-react";
import { CheckCircle2, User, AlertCircle, Key } from "lucide-react";
import StudioLayout from "./StudioLayout";
import { useT } from "@/lib/i18n";

const F = "'Figtree', sans-serif";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: F, fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "5px" }}>{label}</label>
      {children}
    </div>
  );
}

function SInput({ value, onChange, type = "text", placeholder, disabled }: {
  value: string; onChange?: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <input
      type={type}
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

export default function StudioSettingsPage() {
  const { user, setAuth: login, token } = useAuthStore();
  const t = useT();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const updateMyProfile = useUpdateMyProfile();

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    updateMyProfile.mutate(
      { data: { firstName: firstName || null, lastName: lastName || null } },
      {
        onSuccess: (updated) => {
          setMsg({ text: t("settings.saved"), ok: true });
          if (user && token) {
            login(
              { ...user, firstName: updated.firstName ?? null, lastName: updated.lastName ?? null },
              token
            );
          }
        },
        onError: () => setMsg({ text: t("settings.error"), ok: false }),
      }
    );
  }

  const roleLabels: Record<string, string> = {
    buyer: t("settings.role.buyer"),
    artist: t("settings.role.artist"),
    admin: t("settings.role.admin"),
  };

  return (
    <StudioLayout>
      <div style={{ padding: "32px", maxWidth: "600px" }}>
        <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "28px" }}>
          {t("studio.nav.settings")}
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Profile card */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#444444" }}>
                <User size={16} />
              </div>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: "16px", color: "#0A0A0A" }}>{t("settings.profileInfo")}</span>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label={t("settings.email")}>
                <SInput value={user?.email ?? ""} disabled />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label={t("settings.firstName")}>
                  <SInput value={firstName} onChange={setFirstName} placeholder="Jana" />
                </Field>
                <Field label={t("settings.lastName")}>
                  <SInput value={lastName} onChange={setLastName} placeholder="Nováková" />
                </Field>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "4px" }}>
                <button
                  type="submit"
                  disabled={updateMyProfile.isPending}
                  style={{
                    height: "38px", padding: "0 20px", borderRadius: "9999px",
                    background: "#0A0A0A", color: "#FFFFFF", border: "none",
                    fontFamily: F, fontSize: "13px", fontWeight: 500,
                    cursor: updateMyProfile.isPending ? "not-allowed" : "pointer",
                    opacity: updateMyProfile.isPending ? 0.6 : 1,
                  }}
                >
                  {updateMyProfile.isPending ? t("settings.saving") : t("settings.save")}
                </button>

                {msg && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 12px", background: msg.ok ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${msg.ok ? "#86EFAC" : "#FECACA"}`, borderRadius: "9999px" }}>
                    {msg.ok
                      ? <CheckCircle2 size={13} color="#22C55E" />
                      : <AlertCircle size={13} color="#EF4444" />}
                    <span style={{ fontFamily: F, fontSize: "12px", fontWeight: 500, color: msg.ok ? "#22C55E" : "#EF4444" }}>{msg.text}</span>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Account info */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "14px", color: "#0A0A0A", marginBottom: "12px" }}>{t("settings.accountInfo")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: t("settings.role"), value: roleLabels[user?.role ?? ""] ?? user?.role ?? "—" },
                { label: t("settings.memberSince"), value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" }) : "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F2F2F2" }}>
                  <span style={{ fontFamily: F, fontSize: "13px", color: "#888888" }}>{label}</span>
                  <span style={{ fontFamily: F, fontSize: "13px", fontWeight: 500, color: "#0A0A0A" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Password reset */}
          <div style={{ background: "#F9F9F9", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <Key size={16} color="#888888" />
            <div style={{ fontFamily: F, fontSize: "13px", color: "#888888", lineHeight: 1.6, flex: 1 }}>
              {t("settings.passwordHint")}{" "}
              <a href="/forgot-password" style={{ color: "#0A0A0A", fontWeight: 600, textDecoration: "underline" }}>
                {t("settings.passwordLink")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}
