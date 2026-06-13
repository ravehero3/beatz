import { useState } from "react";
import { Link, useLocation } from "wouter";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";

const F = "'Figtree', sans-serif";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please request a new reset link.");
      } else {
        setDone(true);
        setTimeout(() => setLocation("/login"), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9F9F9", padding: "24px" }}>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 24px 64px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src={beatpackLogo} alt="beatpack" style={{ height: "22px", marginBottom: "24px" }} />
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            Choose a new password
          </h1>
          <p style={{ fontFamily: F, fontSize: "14px", color: "#888888" }}>
            Enter a new password for your account.
          </p>
        </div>

        {!token ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
            <p style={{ fontFamily: F, fontSize: "14px", color: "#888888", marginBottom: "24px" }}>
              Invalid or missing reset token.
            </p>
            <Link href="/forgot-password" style={{ fontFamily: F, fontSize: "14px", color: "#0A0A0A", fontWeight: 600, textDecoration: "none" }}>
              Request a new reset link
            </Link>
          </div>
        ) : done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>✅</div>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "8px" }}>Password updated!</div>
            <p style={{ fontFamily: F, fontSize: "14px", color: "#888888" }}>
              Redirecting you to login…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontFamily: F, fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "6px" }}>New password</label>
              <input
                type="password" required autoFocus value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                style={{ width: "100%", height: "44px", padding: "0 14px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: F, fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "6px" }}>Confirm password</label>
              <input
                type="password" required value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                style={{ width: "100%", height: "44px", padding: "0 14px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>
            {error && (
              <p style={{ fontFamily: F, fontSize: "13px", color: "#E53E3E", margin: 0 }}>{error}</p>
            )}
            <button type="submit" disabled={loading} style={{
              height: "44px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none",
              fontFamily: F, fontWeight: 500, fontSize: "14px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: "8px",
            }}>
              {loading ? "Saving…" : "Set new password"}
            </button>
            <Link href="/login" style={{ textAlign: "center", fontFamily: F, fontSize: "14px", color: "#888888", textDecoration: "none" }}>
              ← Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
