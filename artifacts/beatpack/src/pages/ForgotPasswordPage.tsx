import { useState } from "react";
import { Link } from "wouter";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";

const F = "'Figtree', sans-serif";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9F9F9", padding: "24px" }}>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 24px 64px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src={beatpackLogo} alt="beatpack" style={{ height: "22px", marginBottom: "24px" }} />
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            Reset password
          </h1>
          <p style={{ fontFamily: F, fontSize: "14px", color: "#888888" }}>
            Enter your email and we'll send a reset link.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📬</div>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "8px" }}>Check your inbox</div>
            <p style={{ fontFamily: F, fontSize: "14px", color: "#888888", marginBottom: "24px" }}>
              If an account exists for <strong>{email}</strong>, you'll receive a reset link shortly.
            </p>
            <Link href="/login" style={{ fontFamily: F, fontSize: "14px", color: "#0A0A0A", fontWeight: 600, textDecoration: "none" }}>
              ← Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontFamily: F, fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "6px" }}>Email address</label>
              <input
                type="email" required autoFocus value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: "100%", height: "44px", padding: "0 14px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s ease" }}
                onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              height: "44px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none",
              fontFamily: F, fontWeight: 500, fontSize: "14px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: "8px",
            }}>
              {loading ? "Sending…" : "Send reset link"}
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
