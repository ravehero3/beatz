import { useState } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";

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

  if (!user) {
    setLocation("/register");
    return null;
  }
  if (user.role === "artist" || user.role === "admin") {
    setLocation("/studio");
    return null;
  }

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
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setAuth(data.user, data.token);
      setLocation("/studio");
    } catch {
      setError("Something went wrong. Please try again.");
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
          }}>Start selling beats</h1>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888", lineHeight: 1.5 }}>
            Set your artist name and get your own store page.
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
              Artist name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. DJ Novák"
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
              background: "#F9F9F9",
              border: "1px solid #E5E5E5",
              borderRadius: "10px",
              padding: "12px 14px",
            }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888", marginBottom: "2px" }}>
                Your store URL
              </div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#0A0A0A" }}>
                beatpack.cz/artists/<strong>{slug}</strong>
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
            {loading ? "Setting up your store…" : "Start selling"}
          </button>
        </form>
      </div>
    </div>
  );
}
