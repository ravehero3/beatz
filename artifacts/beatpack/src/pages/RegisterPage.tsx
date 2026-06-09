import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegisterUser } from "@workspace/api-client-react";
import { useAuthStore } from "@/store/authStore";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

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

        <a
          href="/api/auth/google"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            height: "44px",
            borderRadius: "9999px",
            border: "1px solid #E5E5E5",
            background: "#FFFFFF",
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            color: "#0A0A0A",
            textDecoration: "none",
            cursor: "pointer",
            transition: "border-color 0.15s ease",
            marginBottom: "20px",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0A0A0A"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E5E5E5"; }}
        >
          <GoogleIcon />
          Continue with Google
        </a>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}>
          <div style={{ flex: 1, height: "1px", background: "#E5E5E5" }} />
          <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#BBBBBB" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#E5E5E5" }} />
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
