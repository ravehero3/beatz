import { Link } from "wouter";
import { ArrowRight, Upload, DollarSign, Zap } from "lucide-react";
import { useT } from "@/lib/i18n";
import heroBg from "@assets/beatpack_headline_background_1781332914315.jpg";

export default function HomePage() {
  const t = useT();

  return (
    <div style={{ paddingTop: "44px" }}>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        {/* Background image — full viewport width */}
        <img
          src={heroBg}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        {/* Content sits above bg, constrained to max-width */}
        <div style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "104px 24px 64px",
          textAlign: "center",
        }}>
          <h1 style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 7.5vw, 6rem)",
            color: "#0A0A0A",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: "24px",
            background: "linear-gradient(160deg, #0A0A0A 0%, #3A3A3A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {t("home.hero.title")}
          </h1>
          <p style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: "18px",
            color: "#888888",
            maxWidth: "440px",
            margin: "0 auto 44px",
            lineHeight: 1.65,
          }}>
            {t("home.hero.sub")}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "48px" }}>
            <Link href="/beats">
              <button
                data-testid="btn-browse-beats"
                style={{
                  height: "48px",
                  padding: "0 32px",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #1a1a1a 0%, #0A0A0A 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)";
                }}
              >
                {t("home.hero.browse")} <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/pricing">
              <button
                data-testid="btn-start-selling"
                style={{
                  height: "48px",
                  padding: "0 32px",
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(12px)",
                  color: "#0A0A0A",
                  border: "1px solid rgba(0,0,0,0.10)",
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.10)";
                }}
              >
                {t("home.hero.sell")}
              </button>
            </Link>
          </div>

          {/* Video placeholder card — 1233×695 (16:9) */}
          <div style={{
            maxWidth: "1233px",
            margin: "0 auto",
            aspectRatio: "1233 / 695",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.60)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
          }} />
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "88px 24px" }}>
        <h2 style={{
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          color: "#0A0A0A",
          letterSpacing: "-0.03em",
          textAlign: "center",
          marginBottom: "52px",
        }}>{t("home.how.title")}</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
        }}>
          {[
            { icon: <Upload size={22} />, title: t("home.how.upload.title"), desc: t("home.how.upload.desc") },
            { icon: <Zap size={22} />, title: t("home.how.price.title"), desc: t("home.how.price.desc") },
            { icon: <DollarSign size={22} />, title: t("home.how.pay.title"), desc: t("home.how.pay.desc") },
          ].map((step, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: "20px",
              padding: "36px 28px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              transition: "transform 0.22s ease, box-shadow 0.22s ease",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
              }}
            >
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #1a1a1a 0%, #0A0A0A 100%)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}>{step.icon}</div>
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 700,
                fontSize: "17px",
                color: "#0A0A0A",
                marginBottom: "10px",
                letterSpacing: "-0.01em",
              }}>{step.title}</div>
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: "14px",
                color: "#888888",
                lineHeight: 1.65,
              }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)",
        padding: "88px 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          color: "#FFFFFF",
          letterSpacing: "-0.035em",
          marginBottom: "16px",
          lineHeight: 1.1,
        }}>{t("home.cta.title")}</h2>
        <p style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: "16px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "36px",
        }}>{t("home.cta.sub")}</p>
        <Link href="/pricing">
          <button
            data-testid="btn-cta-pricing"
            style={{
              height: "48px",
              padding: "0 32px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.95)",
              color: "#0A0A0A",
              border: "none",
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)";
            }}
          >
            {t("home.cta.button")} <ArrowRight size={16} />
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        padding: "32px 24px",
        textAlign: "center",
        background: "rgba(255,255,255,0.5)",
      }}>
        <p style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: "13px",
          color: "#AAAAAA",
        }}>
          {t("home.footer")}
        </p>
      </footer>
    </div>
  );
}
