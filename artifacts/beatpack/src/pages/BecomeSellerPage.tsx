import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";
import { useT } from "@/lib/i18n";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BecomeSellerPage() {
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setAuth, token } = useAuthStore();
  const [, setLocation] = useLocation();
  const t = useT();

  useEffect(() => {
    if (!user) setLocation("/register");
    else if (user.role === "artist" || user.role === "admin") setLocation("/studio");
  }, [user, setLocation]);

  if (!user || user.role === "artist" || user.role === "admin") return null;

  const slug = slugify(displayName);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/become-artist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("seller.error"));
        return;
      }
      setAuth(data.user, data.token);
      setLocation("/studio");
    } catch {
      setError(t("seller.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#F9F9F9",
      padding: "24px",
    }}>
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E5E5E5",
        borderRadius: "20px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.08)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src={beatpackLogo} alt="beatpack" style={{ height: "22px", marginBottom: "24px" }} />
          <h1 style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 700,
            fontSize: "22px",
            color: "#0A0A0A",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}>{t("seller.title")}</h1>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888", lineHeight: 1.5 }}>
            {t("seller.sub")}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{
              display: "block",
              fontFamily: "'Figtree', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#444444",
              marginBottom: "6px",
            }}>
              {t("seller.nameLabel")}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoFocus
              placeholder={t("seller.namePlaceholder")}
              data-testid="input-display-name"
              style={{
                width: "100%",
                height: "44px",
                padding: "0 14px",
                borderRadius: "10px",
                border: "1px solid #E5E5E5",
                fontFamily: "'Figtree', sans-serif",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
            />
          </div>

          {slug && (
            <div style={{
              background: "linear-gradient(135deg, #F0F4FF 0%, #F8F0FF 100%)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "12px",
              padding: "14px 16px",
            }}>
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                color: "#7C3AED",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "6px",
              }}>
                {t("seller.urlLabel")}
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
                background: "rgba(255,255,255,0.7)",
                borderRadius: "8px",
                padding: "7px 12px",
                border: "1px solid rgba(99,102,241,0.15)",
              }}>
                <span style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#4F46E5",
                  letterSpacing: "-0.01em",
                }}>
                  {slug}
                </span>
                <span style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#888888",
                }}>
                  .beatpack.cz
                </span>
              </div>
            </div>
          )}

          {error && (
            <div style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              padding: "10px 12px",
              fontFamily: "'Figtree', sans-serif",
              fontSize: "13px",
              color: "#EF4444",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !displayName.trim()}
            data-testid="btn-become-seller"
            style={{
              height: "44px",
              borderRadius: "9999px",
              background: "#0A0A0A",
              color: "#FFFFFF",
              border: "none",
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              cursor: loading || !displayName.trim() ? "not-allowed" : "pointer",
              opacity: loading || !displayName.trim() ? 0.5 : 1,
              transition: "opacity 0.15s ease",
            }}
          >
            {loading ? t("seller.submitting") : t("seller.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
