import { Link } from "wouter";
import { ArrowRight, Upload, DollarSign, Zap, Users } from "lucide-react";
import { useT } from "@/lib/i18n";
import heroBg from "@assets/beatpack_headline_background_2_1781422880067.jpg";

export default function HomePage() {
  const t = useT();

  return (
    <div style={{ paddingTop: "44px" }}>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={heroBg}
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            zIndex: 0, pointerEvents: "none", userSelect: "none",
          }}
        />
        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: "1280px", margin: "0 auto",
          padding: "96px 24px 72px", textAlign: "center",
        }}>
          {/* Social proof pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: "9999px", padding: "6px 14px 6px 8px",
            marginBottom: "28px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "-4px",
            }}>
              {["#E9967A","#87CEEB","#90EE90"].map((c, i) => (
                <div key={i} style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: c, border: "2px solid white",
                  marginLeft: i === 0 ? 0 : "-6px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }} />
              ))}
            </div>
            <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", fontWeight: 600, color: "#0A0A0A" }}>
              500+ beats sold this month
            </span>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 2px rgba(34,197,94,0.25)" }} />
          </div>

          <h1 style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 7.5vw, 6rem)",
            color: "#0A0A0A",
            letterSpacing: "-0.04em",
            lineHeight: 1.15,
            marginBottom: "24px",
            paddingBottom: "0.1em",
            background: "linear-gradient(160deg, #0A0A0A 0%, #3A3A3A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {t("home.hero.title")}
          </h1>
          <p style={{
            fontFamily: "'Figtree', sans-serif", fontSize: "18px",
            color: "#888888", maxWidth: "440px", margin: "0 auto 44px", lineHeight: 1.65,
          }}>
            {t("home.hero.sub")}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "nowrap", marginBottom: "56px" }}>
            <Link href="/beats">
              <button
                data-testid="btn-browse-beats"
                className="h-10 md:h-12 px-5 md:px-8 text-[13px] md:text-[14px]"
                style={{
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #1a1a1a 0%, #0A0A0A 100%)",
                  color: "#FFFFFF", border: "none",
                  fontFamily: "'Figtree', sans-serif", fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                  whiteSpace: "nowrap",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)";
                }}
              >
                {t("home.hero.browse")} <ArrowRight size={14} />
              </button>
            </Link>
            <Link href="/pricing">
              <button
                data-testid="btn-start-selling"
                className="h-10 md:h-12 px-5 md:px-8 text-[13px] md:text-[14px]"
                style={{
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.82)",
                  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  color: "#0A0A0A",
                  border: "1px solid rgba(255,255,255,0.9)",
                  fontFamily: "'Figtree', sans-serif", fontWeight: 500,
                  cursor: "pointer", whiteSpace: "nowrap",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)";
                }}
              >
                {t("home.hero.sell")}
              </button>
            </Link>
          </div>

          {/* App preview card */}
          <div style={{
            maxWidth: "1100px", margin: "0 auto",
            aspectRatio: "16 / 9",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.68)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.85)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Fake browser chrome */}
            <div style={{
              height: "36px", background: "rgba(255,255,255,0.6)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", padding: "0 16px", gap: "6px",
            }}>
              {["#FF6058","#FFBD2E","#28C840"].map((c, i) => (
                <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
              ))}
              <div style={{
                flex: 1, height: "20px", background: "rgba(0,0,0,0.05)",
                borderRadius: "6px", margin: "0 12px",
              }} />
            </div>
            <div style={{
              position: "absolute", inset: "36px 0 0",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ textAlign: "center", color: "rgba(0,0,0,0.2)" }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>♪</div>
                <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500 }}>Your beats. Your store.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — Bento grid */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{
            display: "inline-block", fontFamily: "'Figtree', sans-serif",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#AAAAAA", marginBottom: "12px",
          }}>How it works</div>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif", fontWeight: 800,
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#0A0A0A",
            letterSpacing: "-0.04em", lineHeight: 1.1,
          }}>{t("home.how.title")}</h2>
        </div>

        {/* Bento grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "auto",
          gap: "16px",
        }}>
          {/* Big hero card — Upload */}
          <div style={{
            gridColumn: "span 7",
            background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
            borderRadius: "24px", padding: "40px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            minHeight: "300px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            position: "relative", overflow: "hidden",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)"; }}
          >
            {/* Ambient glow */}
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "200px", height: "200px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              width: "52px", height: "52px", borderRadius: "16px",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
            }}>
              <Upload size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{
                fontFamily: "'Figtree', sans-serif", fontWeight: 800,
                fontSize: "24px", color: "#FFFFFF", letterSpacing: "-0.03em",
                marginBottom: "10px", lineHeight: 1.2,
              }}>{t("home.how.upload.title")}</div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                {t("home.how.upload.desc")}
              </div>
            </div>
          </div>

          {/* Set Price card */}
          <div style={{
            gridColumn: "span 5",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.07)",
            borderRadius: "24px", padding: "36px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            transition: "transform 0.22s ease, box-shadow 0.22s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.10)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)"; }}
          >
            <div style={{
              width: "52px", height: "52px", borderRadius: "16px",
              background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
              border: "1px solid rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Zap size={22} color="#0A0A0A" />
            </div>
            <div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "20px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
                {t("home.how.price.title")}
              </div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888", lineHeight: 1.6 }}>
                {t("home.how.price.desc")}
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div style={{
            gridColumn: "span 4",
            background: "linear-gradient(135deg, #F8F8F8 0%, #F0F0F0 100%)",
            borderRadius: "24px", padding: "32px",
            display: "flex", flexDirection: "column", gap: "20px",
            border: "1px solid rgba(0,0,0,0.05)",
            transition: "transform 0.22s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <Users size={16} color="#0A0A0A" />
              </div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: "#444" }}>Active producers</div>
            </div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: "42px", color: "#0A0A0A", letterSpacing: "-0.04em", lineHeight: 1 }}>
              1,200<span style={{ fontSize: "22px", color: "#AAAAAA" }}>+</span>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {[65, 80, 55, 90, 70, 95, 75].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h * 0.36}px`, background: i === 6 ? "#0A0A0A" : "#D4D4D4", borderRadius: "3px", alignSelf: "flex-end", transition: "background 0.2s" }} />
              ))}
            </div>
          </div>

          {/* Get Paid card — wide */}
          <div style={{
            gridColumn: "span 8",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.07)",
            borderRadius: "24px", padding: "36px",
            display: "flex", alignItems: "center", gap: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            transition: "transform 0.22s ease, box-shadow 0.22s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.10)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)"; }}
          >
            <div style={{
              width: "64px", height: "64px", borderRadius: "20px", flexShrink: 0,
              background: "linear-gradient(135deg, #F0FFF4 0%, #DCFCE7 100%)",
              border: "1px solid rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <DollarSign size={28} color="#0A0A0A" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
                {t("home.how.pay.title")}
              </div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888", lineHeight: 1.6 }}>
                {t("home.how.pay.desc")}
              </div>
            </div>
            <div style={{
              display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0,
            }}>
              {[
                { label: "Basic license", amount: "499 Kč" },
                { label: "Premium license", amount: "999 Kč" },
                { label: "Exclusive", amount: "2 490 Kč" },
              ].map((item) => (
                <div key={item.label} style={{
                  display: "flex", gap: "16px", alignItems: "center",
                  background: "rgba(0,0,0,0.03)", borderRadius: "8px", padding: "6px 12px",
                }}>
                  <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: "#888888" }}>{item.label}</span>
                  <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 700, color: "#0A0A0A" }}>{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)",
        padding: "100px 24px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Ambient orbs */}
        <div style={{ position: "absolute", top: "-80px", left: "20%", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "15%", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif", fontWeight: 800,
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#FFFFFF",
            letterSpacing: "-0.04em", marginBottom: "16px", lineHeight: 1.1,
          }}>{t("home.cta.title")}</h2>
          <p style={{
            fontFamily: "'Figtree', sans-serif", fontSize: "16px",
            color: "rgba(255,255,255,0.4)", marginBottom: "40px",
          }}>{t("home.cta.sub")}</p>
          <Link href="/pricing">
            <button
              data-testid="btn-cta-pricing"
              style={{
                height: "52px", padding: "0 36px", borderRadius: "9999px",
                background: "rgba(255,255,255,0.95)", color: "#0A0A0A",
                border: "1px solid rgba(255,255,255,0.5)",
                fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "14px",
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)";
              }}
            >
              {t("home.cta.button")} <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        padding: "28px 24px",
        textAlign: "center",
        background: "#FAFAFA",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap",
      }}>
        <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#AAAAAA" }}>
          {t("home.footer")}
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          {["/beats", "/artists", "/pricing"].map((href) => (
            <Link key={href} href={href} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#CCCCCC", textDecoration: "none" }}>
              {href.replace("/", "").charAt(0).toUpperCase() + href.slice(2)}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
