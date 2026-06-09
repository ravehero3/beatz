import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegisterUser } from "@workspace/api-client-react";
import { useAuthStore } from "@/store/authStore";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const registerMutation = useRegisterUser();
  const { setAuth } = useAuthStore();
  const [, setLocation] = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    registerMutation.mutate(
      { data: { email, password, firstName, lastName } },
      {
        onSuccess: (result) => {
          setAuth(result.user, result.token);
          setLocation("/");
        },
        onError: () => {
          setError("Registration failed. The email may already be in use.");
        },
      }
    );
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
        maxWidth: "400px",
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
          }}>Create your account</h1>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>
            Start buying and selling beats today
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "5px" }}>First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jan"
                data-testid="input-first-name"
                style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "5px" }}>Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Novák"
                data-testid="input-last-name"
                style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "5px" }}>Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              data-testid="input-email"
              style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
            />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "5px" }}>Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
              data-testid="input-password"
              style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
            />
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 12px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#EF4444" }} data-testid="error-register">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            data-testid="btn-submit-register"
            style={{
              height: "44px",
              borderRadius: "9999px",
              background: "#0A0A0A",
              color: "#FFFFFF",
              border: "none",
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              cursor: registerMutation.isPending ? "not-allowed" : "pointer",
              opacity: registerMutation.isPending ? 0.6 : 1,
              marginTop: "8px",
            }}
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#0A0A0A", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
