import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";

export default function GoogleCallbackPage() {
  const [, setLocation] = useLocation();
  const { setAuth, setToken } = useAuthStore();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    const isNew = params.get("new") === "1";

    if (error || !token) {
      setLocation("/login");
      return;
    }

    setToken(token);

    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((user) => {
        setAuth(user, token);
        setLocation(isNew ? "/onboarding" : "/");
      })
      .catch(() => {
        setLocation("/login");
      });
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#F9F9F9",
      fontFamily: "'Figtree', sans-serif",
      fontSize: "15px",
      color: "#888888",
    }}>
      Signing you in…
    </div>
  );
}
