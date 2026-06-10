import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";
import { Mic2, Headphones, Radio, Building2, Lock } from "lucide-react";

type UserType = "rapper" | "beatmaker" | "listener" | "label";

const types: {
  key: UserType;
  icon: React.ReactNode;
  title: string;
  titleEn: string;
  sub: string;
  subEn: string;
  free: boolean;
}[] = [
  {
    key: "rapper",
    icon: <Mic2 size={28} />,
    title: "Rapper",
    titleEn: "Rapper",
    sub: "Kupuj beaty a vytvoř svůj umělecký profil",
    subEn: "Buy beats and build your artist profile",
    free: true,
  },
  {
    key: "beatmaker",
    icon: <Radio size={28} />,
    title: "Beat Maker",
    titleEn: "Beat Maker",
    sub: "Nahraj a prodávej své beaty",
    subEn: "Upload and sell your beats",
    free: true,
  },
  {
    key: "listener",
    icon: <Headphones size={28} />,
    title: "Posluchač",
    titleEn: "Listener",
    sub: "Procházej a objevuj nové beaty",
    subEn: "Browse and discover new beats",
    free: true,
  },
  {
    key: "label",
    icon: <Building2 size={28} />,
    title: "Label",
    titleEn: "Label",
    sub: "Spravuj umělce a beaty svého labelu",
    subEn: "Manage your label's artists and beats",
    free: false,
  },
];

export default function OnboardingPage() {
  const { setUserType } = useAuthStore();
  const [, setLocation] = useLocation();
  const F = "'Figtree', sans-serif";

  function handleSelect(type: UserType) {
    if (type === "label") {
      setUserType("label");
      setLocation("/pricing");
      return;
    }
    setUserType(type);
    setLocation(`/profile-setup/${type}`);
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
      <div style={{ width: "100%", maxWidth: "560px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <img src={beatpackLogo} alt="beatpack" style={{ height: "22px", marginBottom: "28px" }} />
          <h1 style={{
            fontFamily: F,
            fontWeight: 700,
            fontSize: "26px",
            color: "#0A0A0A",
            letterSpacing: "-0.02em",
            marginBottom: "10px",
          }}>
            Kdo jsi?
          </h1>
          <p style={{ fontFamily: F, fontSize: "15px", color: "#888888", lineHeight: 1.6 }}>
            Vyber typ svého profilu. Můžeš ho kdykoli změnit.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {types.map((t) => (
            <button
              key={t.key}
              onClick={() => handleSelect(t.key)}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E5E5",
                borderRadius: "16px",
                padding: "24px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.18s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!t.free) return;
                e.currentTarget.style.borderColor = "#0A0A0A";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E5E5E5";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {!t.free && (
                <span style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "linear-gradient(135deg, #6366F1, #3B82F6)",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontFamily: F,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}>
                  <Lock size={9} /> Pro+
                </span>
              )}
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: t.free ? "#F2F2F2" : "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(59,130,246,0.1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: t.free ? "#0A0A0A" : "#6366F1",
                marginBottom: "14px",
              }}>
                {t.icon}
              </div>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: "16px", color: "#0A0A0A", marginBottom: "6px" }}>
                {t.title}
              </div>
              <div style={{ fontFamily: F, fontSize: "13px", color: "#888888", lineHeight: 1.5 }}>
                {t.sub}
              </div>
            </button>
          ))}
        </div>

        <p style={{
          textAlign: "center",
          marginTop: "28px",
          fontFamily: F,
          fontSize: "13px",
          color: "#AAAAAA",
        }}>
          Label vyžaduje předplatné Pro+
        </p>
      </div>
    </div>
  );
}
