import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLoginUser, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginMutation = useLoginUser();
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    loginMutation.mutate(
      { data: { email, password } },
      {
        onSuccess: (result) => {
          setAuth(result.user, result.token);
          queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
          setLocation("/");
        },
        onError: () => {
          setError("Invalid email or password. Please try again.");
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
          }}>Welcome back</h1>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>
            Sign in to your Beatpack account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{
              display: "block",
              fontFamily: "'Figtree', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#444444",
              marginBottom: "6px",
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              data-testid="input-email"
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
          <div>
            <label style={{
              display: "block",
              fontFamily: "'Figtree', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#444444",
              marginBottom: "6px",
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              data-testid="input-password"
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

          {error && (
            <div style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              padding: "10px 12px",
              fontFamily: "'Figtree', sans-serif",
              fontSize: "13px",
              color: "#EF4444",
            }} data-testid="error-login">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            data-testid="btn-submit-login"
            style={{
              height: "44px",
              borderRadius: "9999px",
              background: "#0A0A0A",
              color: "#FFFFFF",
              border: "none",
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              cursor: loginMutation.isPending ? "not-allowed" : "pointer",
              opacity: loginMutation.isPending ? 0.6 : 1,
              transition: "all 0.15s ease",
              marginTop: "8px",
            }}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "24px",
          fontFamily: "'Figtree', sans-serif",
          fontSize: "14px",
          color: "#888888",
        }}>
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "#0A0A0A", fontWeight: 600, textDecoration: "none" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
