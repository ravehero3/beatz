import { useState } from "react";
import { Link } from "wouter";
import {
  Music2, User, CreditCard, Paintbrush, BarChart2, Headphones,
  Zap, FileText, Link2, Package, Users, Shield, Globe, MessageSquare,
  Check, X,
} from "lucide-react";
import { useT } from "@/lib/i18n";

type BillingPeriod = "monthly" | "yearly";

const MONTHLY_PRO = 249;
const MONTHLY_PROPLUS = 699;
const YEARLY_PRO = 2490;
const YEARLY_PROPLUS = 6990;
const YEARLY_PRO_FULL = MONTHLY_PRO * 12;       // 2988
const YEARLY_PROPLUS_FULL = MONTHLY_PROPLUS * 12; // 8388
const SAVE_PRO = YEARLY_PRO_FULL - YEARLY_PRO;     // 498
const SAVE_PROPLUS = YEARLY_PROPLUS_FULL - YEARLY_PROPLUS; // 1398

function BillingToggle({
  billing,
  setBilling,
  t,
}: {
  billing: BillingPeriod;
  setBilling: (b: BillingPeriod) => void;
  t: (k: Parameters<ReturnType<typeof useT>>[0]) => string;
}) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      background: "rgba(0,0,0,0.07)",
      borderRadius: "9999px",
      padding: "3px",
      gap: "0",
      position: "relative",
    }}>
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: billing === "monthly" ? "3px" : "calc(50% + 0px)",
          width: "calc(50% - 3px)",
          height: "calc(100% - 6px)",
          background: "#FFFFFF",
          borderRadius: "9999px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.20), 0 0 0 0.5px rgba(0,0,0,0.05)",
          transition: "left 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
          pointerEvents: "none",
        }}
      />
      {(["monthly", "yearly"] as const).map((b) => (
        <button
          key={b}
          onClick={() => setBilling(b)}
          style={{
            height: "30px",
            padding: "0 18px",
            borderRadius: "9999px",
            border: "none",
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 500,
            fontSize: "13px",
            cursor: "pointer",
            background: "transparent",
            color: billing === b ? "#0A0A0A" : "#777777",
            whiteSpace: "nowrap",
            position: "relative",
            zIndex: 1,
            transition: "color 0.15s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {b === "monthly" ? t("pricing.monthly") : t("pricing.yearly")}
          {b === "yearly" && (
            <span style={{
              fontSize: "10px",
              fontWeight: 700,
              color: billing === "yearly" ? "#16A34A" : "#888888",
              background: billing === "yearly" ? "rgba(22,163,74,0.10)" : "transparent",
              borderRadius: "9999px",
              padding: "1px 6px",
              transition: "all 0.15s ease",
              letterSpacing: "0.01em",
            }}>
              {t("pricing.save")}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function SparkleIcon({ style }: { style: React.CSSProperties }) {
  return (
    <span className="pricing-sparkle" style={style}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 0L8.2 5.8L14 7L8.2 8.2L7 14L5.8 8.2L0 7L5.8 5.8L7 0Z" fill="url(#sg)" />
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="14" y2="14">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

const PROPLUS_STARS: { x: number; y: number; r: number; opacity: number }[] = [
  { x: 5.2,  y: 8.1,  r: 1.0, opacity: 0.55 }, { x: 14.7, y: 3.4,  r: 0.7, opacity: 0.40 },
  { x: 22.3, y: 13.8, r: 1.3, opacity: 0.65 }, { x: 31.0, y: 6.2,  r: 0.8, opacity: 0.50 },
  { x: 40.5, y: 2.9,  r: 1.1, opacity: 0.45 }, { x: 49.8, y: 9.7,  r: 0.6, opacity: 0.60 },
  { x: 57.1, y: 4.5,  r: 1.4, opacity: 0.70 }, { x: 66.9, y: 11.3, r: 0.9, opacity: 0.42 },
  { x: 75.4, y: 5.8,  r: 1.2, opacity: 0.58 }, { x: 84.0, y: 2.1,  r: 0.7, opacity: 0.48 },
  { x: 91.6, y: 8.9,  r: 1.0, opacity: 0.62 }, { x: 8.3,  y: 18.4, r: 0.8, opacity: 0.35 },
  { x: 18.9, y: 24.7, r: 1.5, opacity: 0.72 }, { x: 27.5, y: 19.2, r: 0.6, opacity: 0.44 },
  { x: 36.1, y: 27.8, r: 1.1, opacity: 0.55 }, { x: 44.7, y: 21.3, r: 0.9, opacity: 0.38 },
  { x: 53.2, y: 16.9, r: 1.3, opacity: 0.66 }, { x: 62.8, y: 23.5, r: 0.7, opacity: 0.50 },
  { x: 71.3, y: 18.1, r: 1.0, opacity: 0.45 }, { x: 79.9, y: 26.4, r: 1.4, opacity: 0.68 },
  { x: 88.5, y: 20.7, r: 0.8, opacity: 0.40 }, { x: 95.1, y: 15.3, r: 1.1, opacity: 0.57 },
  { x: 3.7,  y: 34.6, r: 1.2, opacity: 0.52 }, { x: 12.4, y: 40.2, r: 0.6, opacity: 0.38 },
  { x: 21.0, y: 36.9, r: 1.5, opacity: 0.74 }, { x: 29.6, y: 43.5, r: 0.9, opacity: 0.46 },
  { x: 38.2, y: 38.1, r: 1.0, opacity: 0.60 }, { x: 46.8, y: 45.7, r: 0.7, opacity: 0.42 },
  { x: 55.3, y: 32.4, r: 1.3, opacity: 0.63 }, { x: 63.9, y: 39.0, r: 0.8, opacity: 0.48 },
  { x: 72.5, y: 44.6, r: 1.1, opacity: 0.55 }, { x: 81.0, y: 35.3, r: 0.6, opacity: 0.36 },
  { x: 89.6, y: 41.9, r: 1.4, opacity: 0.70 }, { x: 97.2, y: 33.7, r: 0.9, opacity: 0.44 },
  { x: 6.8,  y: 52.3, r: 1.0, opacity: 0.56 }, { x: 16.3, y: 58.9, r: 0.7, opacity: 0.40 },
  { x: 24.9, y: 54.6, r: 1.3, opacity: 0.67 }, { x: 33.5, y: 62.2, r: 0.8, opacity: 0.49 },
  { x: 42.1, y: 56.8, r: 1.5, opacity: 0.75 }, { x: 50.6, y: 63.4, r: 0.6, opacity: 0.37 },
  { x: 59.2, y: 50.1, r: 1.2, opacity: 0.61 }, { x: 67.8, y: 57.7, r: 0.9, opacity: 0.47 },
  { x: 76.3, y: 62.3, r: 1.1, opacity: 0.53 }, { x: 84.9, y: 53.0, r: 0.7, opacity: 0.43 },
  { x: 93.5, y: 59.6, r: 1.4, opacity: 0.69 }, { x: 10.1, y: 70.8, r: 0.8, opacity: 0.38 },
  { x: 19.6, y: 76.4, r: 1.2, opacity: 0.58 }, { x: 28.2, y: 71.1, r: 0.6, opacity: 0.44 },
  { x: 36.8, y: 78.7, r: 1.5, opacity: 0.72 }, { x: 45.4, y: 73.3, r: 1.0, opacity: 0.50 },
  { x: 53.9, y: 80.9, r: 0.8, opacity: 0.41 }, { x: 62.5, y: 74.6, r: 1.3, opacity: 0.64 },
  { x: 71.1, y: 81.2, r: 0.7, opacity: 0.46 }, { x: 79.6, y: 70.8, r: 1.1, opacity: 0.56 },
  { x: 88.2, y: 77.5, r: 0.9, opacity: 0.39 }, { x: 4.5,  y: 88.2, r: 1.4, opacity: 0.68 },
  { x: 13.1, y: 93.8, r: 0.6, opacity: 0.36 }, { x: 22.7, y: 89.5, r: 1.0, opacity: 0.54 },
  { x: 31.3, y: 96.1, r: 0.8, opacity: 0.42 }, { x: 47.9, y: 90.7, r: 1.3, opacity: 0.62 },
  { x: 56.5, y: 85.3, r: 0.7, opacity: 0.47 }, { x: 65.0, y: 92.9, r: 1.5, opacity: 0.73 },
  { x: 73.6, y: 87.5, r: 0.9, opacity: 0.45 }, { x: 82.2, y: 94.2, r: 1.1, opacity: 0.57 },
  { x: 90.7, y: 88.8, r: 0.6, opacity: 0.33 }, { x: 96.3, y: 95.4, r: 1.2, opacity: 0.60 },
];

const SPARKLE_POSITIONS: React.CSSProperties[] = [
  { top: "-18px", left: "12%", animationDelay: "0s" },
  { top: "-14px", right: "20%", animationDelay: "0.15s" },
  { top: "20%", right: "-18px", animationDelay: "0.3s" },
  { bottom: "22%", right: "-16px", animationDelay: "0.08s" },
  { bottom: "-16px", right: "18%", animationDelay: "0.22s" },
  { bottom: "-14px", left: "25%", animationDelay: "0.38s" },
  { top: "30%", left: "-18px", animationDelay: "0.12s" },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>("yearly");
  const [proplusHovered, setProplusHovered] = useState(false);
  const t = useT();

  const plans = [
    {
      key: "free",
      name: "Free",
      price: 0,
      features: [
        { text: t("pricing.free.f1"), icon: <Music2 size={14} />, included: true },
        { text: t("pricing.free.f2"), icon: <Globe size={14} />, included: true },
        { text: t("pricing.free.f3"), icon: <CreditCard size={14} />, included: true },
        { text: t("pricing.free.f4"), icon: <BarChart2 size={14} />, included: true },
        { text: t("pricing.free.f5"), icon: <Zap size={14} />, included: false },
        { text: t("pricing.free.f6"), icon: <CreditCard size={14} />, included: false },
        { text: t("pricing.free.f7"), icon: <BarChart2 size={14} />, included: false },
      ],
    },
    {
      key: "pro",
      name: "Pro",
      monthlyPrice: MONTHLY_PRO,
      yearlyPrice: YEARLY_PRO,
      yearlyFull: YEARLY_PRO_FULL,
      savingsPerYear: SAVE_PRO,
      features: [
        { text: t("pricing.pro.f1"), icon: <Zap size={14} />, included: true },
        { text: t("pricing.pro.f2"), icon: <CreditCard size={14} />, included: true },
        { text: t("pricing.pro.f3"), icon: <BarChart2 size={14} />, included: true },
        { text: t("pricing.pro.f4"), icon: <Paintbrush size={14} />, included: true },
        { text: t("pricing.pro.f5"), icon: <FileText size={14} />, included: true },
        { text: t("pricing.pro.f6"), icon: <Link2 size={14} />, included: true },
        { text: t("pricing.pro.f7"), icon: <Headphones size={14} />, included: true },
      ],
    },
    {
      key: "proplus",
      name: "Pro+",
      nameSub: "Label",
      monthlyPrice: MONTHLY_PROPLUS,
      yearlyPrice: YEARLY_PROPLUS,
      yearlyFull: YEARLY_PROPLUS_FULL,
      savingsPerYear: SAVE_PROPLUS,
      features: [
        { text: t("pricing.proplus.f1"), icon: <Package size={14} />, included: true },
        { text: t("pricing.proplus.f2"), icon: <Users size={14} />, included: true },
        { text: t("pricing.proplus.f3"), icon: <Shield size={14} />, included: true },
        { text: t("pricing.proplus.f4"), icon: <Zap size={14} />, included: true },
        { text: t("pricing.proplus.f5"), icon: <Globe size={14} />, included: true },
        { text: t("pricing.proplus.f6"), icon: <MessageSquare size={14} />, included: true },
      ],
    },
  ];

  const lang = t("pricing.monthly") === "Monthly" ? "en" : "cs";

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 24px 96px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            color: "#0A0A0A",
            letterSpacing: "-0.04em",
            marginBottom: "12px",
            background: "linear-gradient(160deg, #0A0A0A 0%, #3A3A3A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{t("pricing.title")}</h1>
          <p style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: "16px",
            color: "#888888",
            marginBottom: "28px",
          }}>
            {t("pricing.sub")}
          </p>

          {/* Single top-level billing toggle */}
          <BillingToggle billing={billing} setBilling={setBilling} t={t} />
        </div>

        {/* Plans grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          alignItems: "stretch",
        }}>
          {plans.map((plan) => {
            const isFree = plan.key === "free";
            const isPro = plan.key === "pro";
            const isProPlus = plan.key === "proplus";

            const paidPlan = plan as {
              monthlyPrice: number; yearlyPrice: number;
              yearlyFull: number; savingsPerYear: number;
            };

            const displayPrice = isFree ? 0
              : billing === "monthly" ? paidPlan.monthlyPrice
              : paidPlan.yearlyPrice;

            const cardStyle: React.CSSProperties = isFree
              ? {
                  background: "rgba(245,245,245,0.8)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderRadius: "20px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                }
              : isPro
              ? {
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: "20px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 20px 50px rgba(59, 130, 246, 0.14), 0 4px 16px rgba(59, 130, 246, 0.07)",
                }
              : {
                  background: "rgba(255,255,255,0.38)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.72)",
                  borderRadius: "20px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 8px 32px rgba(80,100,200,.10), inset 0 1px 0 rgba(255,255,255,0.95)",
                  position: "relative",
                  zIndex: 1,
                  flex: 1,
                };

            if (isProPlus) {
              return (
                <div
                  key={plan.key}
                  style={{
                    position: "relative",
                    borderRadius: "26px",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    background: "hsl(240,30%,98.5%)",
                    overflow: "hidden",
                  }}
                  onMouseEnter={() => setProplusHovered(true)}
                  onMouseLeave={() => setProplusHovered(false)}
                >
                  {/* Conic gradient colour wash */}
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "26px", pointerEvents: "none",
                    background: "conic-gradient(from 210deg at 25% 75%, rgba(180,200,255,.28), rgba(255,230,200,.22), rgba(200,255,220,.18), rgba(230,200,255,.26), rgba(180,200,255,.28))",
                  }} />
                  {/* Radial highlight top-left */}
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "26px", pointerEvents: "none",
                    background: "radial-gradient(ellipse 70% 55% at top left, rgba(190,210,255,.35), transparent 60%)",
                  }} />
                  {/* Star field */}
                  <svg
                    aria-hidden="true"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    {PROPLUS_STARS.map((s, i) => (
                      <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.55} fill="white" opacity={s.opacity} />
                    ))}
                  </svg>
                  {/* Sparkles on hover */}
                  {proplusHovered && SPARKLE_POSITIONS.map((pos, i) => (
                    <SparkleIcon key={i} style={{ position: "absolute", ...pos }} />
                  ))}
                  {/* Glass card surface */}
                  <div
                    data-testid="card-plan-proplus"
                    style={cardStyle}
                  >

                {/* Plan name + badge */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <span style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 700,
                      fontSize: "17px",
                      color: isFree ? "#666666" : "#0A0A0A",
                      letterSpacing: "-0.02em",
                    }}>
                      {plan.name}
                    </span>
                    {(plan as { nameSub?: string }).nameSub && (
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#888888",
                      }}>/ {(plan as { nameSub?: string }).nameSub}</span>
                    )}
                    {isPro && (
                      <span style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        background: "rgba(59,130,246,0.12)",
                        color: "#3B82F6",
                        borderRadius: "9999px",
                        padding: "2px 8px",
                      }}>
                        {t("pricing.mostPopular")}
                      </span>
                    )}
                  </div>

                  {/* Price display */}
                  {isFree ? (
                    <div>
                      <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "30px", color: "#666666" }}>
                        {t("pricing.freeLabel")}
                      </span>
                      <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#AAAAAA", marginLeft: "6px" }}>
                        {t("pricing.forever")}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontWeight: 800,
                          fontSize: "32px",
                          color: "#0A0A0A",
                          letterSpacing: "-0.03em",
                          lineHeight: 1,
                        }}>
                          {displayPrice.toLocaleString("cs-CZ")} Kč
                        </span>
                        <span style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: "13px",
                          fontWeight: 400,
                          color: "#888888",
                        }}>
                          {billing === "monthly" ? t("pricing.perMonth") : t("pricing.perYear")}
                        </span>
                      </div>

                      {/* Crossed-out + savings — only on yearly */}
                      {billing === "yearly" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                          <span style={{
                            fontFamily: "'Figtree', sans-serif",
                            fontSize: "13px",
                            color: "#AAAAAA",
                            textDecoration: "line-through",
                          }}>
                            {paidPlan.yearlyFull.toLocaleString("cs-CZ")} Kč
                          </span>
                          <span style={{
                            fontFamily: "'Figtree', sans-serif",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#16A34A",
                            background: "rgba(22,163,74,0.10)",
                            borderRadius: "9999px",
                            padding: "2px 8px",
                          }}>
                            {lang === "cs"
                              ? `Ušetříte ${paidPlan.savingsPerYear.toLocaleString("cs-CZ")} Kč`
                              : `Save ${paidPlan.savingsPerYear.toLocaleString("en")} CZK`}
                          </span>
                        </div>
                      )}

                      {/* Monthly equivalent when on yearly */}
                      {billing === "yearly" && (
                        <div style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: "12px",
                          color: "#AAAAAA",
                          marginTop: "4px",
                        }}>
                          ≈ {Math.round(displayPrice / 12).toLocaleString("cs-CZ")} Kč{t("pricing.perMonth")}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: "9px", flex: 1 }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <span style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1px",
                        color: feature.included
                          ? isFree ? "#888888" : isPro ? "#3B82F6" : "#8B5CF6"
                          : "#DDDDDD",
                      }}>
                        {feature.included
                          ? <Check size={14} strokeWidth={2.5} />
                          : <X size={14} strokeWidth={2} />
                        }
                      </span>
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: "13.5px",
                        color: feature.included
                          ? isFree ? "#666666" : "#333333"
                          : "#C0C0C0",
                        lineHeight: 1.45,
                      }}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div style={{ marginTop: "24px" }}>
                  <Link href={isFree ? "/register" : "/register"}>
                    <button
                      data-testid={`btn-cta-${plan.key}`}
                      style={{
                        width: "100%",
                        height: "44px",
                        borderRadius: "9999px",
                        background: isFree
                          ? "rgba(0,0,0,0.07)"
                          : isPro
                          ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
                          : "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                        color: isFree ? "#555555" : "#FFFFFF",
                        border: "none",
                        fontFamily: "'Figtree', sans-serif",
                        fontWeight: 600,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "opacity 0.15s ease, transform 0.15s ease",
                        boxShadow: isFree
                          ? "none"
                          : isPro
                          ? "0 4px 14px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15)"
                          : "0 4px 14px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      }}
                    >
                      {isFree ? t("pricing.free.cta") : isPro ? t("pricing.pro.cta") : t("pricing.proplus.cta")}
                    </button>
                  </Link>
                </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={plan.key}
                data-testid={`card-plan-${plan.key}`}
                style={cardStyle}
              >
                {/* Plan name + badge */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <span style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 700,
                      fontSize: "17px",
                      color: isFree ? "#666666" : "#0A0A0A",
                      letterSpacing: "-0.02em",
                    }}>
                      {plan.name}
                    </span>
                    {(plan as { nameSub?: string }).nameSub && (
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#888888",
                      }}>/ {(plan as { nameSub?: string }).nameSub}</span>
                    )}
                    {isPro && (
                      <span style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        background: "rgba(59,130,246,0.12)",
                        color: "#3B82F6",
                        borderRadius: "9999px",
                        padding: "2px 8px",
                      }}>
                        {t("pricing.mostPopular")}
                      </span>
                    )}
                  </div>
                  {isFree ? (
                    <div>
                      <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "30px", color: "#666666" }}>
                        {t("pricing.freeLabel")}
                      </span>
                      <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#AAAAAA", marginLeft: "6px" }}>
                        {t("pricing.forever")}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontWeight: 800,
                          fontSize: "32px",
                          color: "#0A0A0A",
                          letterSpacing: "-0.03em",
                          lineHeight: 1,
                        }}>
                          {displayPrice.toLocaleString("cs-CZ")} Kč
                        </span>
                        <span style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: "13px",
                          fontWeight: 400,
                          color: "#888888",
                        }}>
                          {billing === "monthly" ? t("pricing.perMonth") : t("pricing.perYear")}
                        </span>
                      </div>
                      {billing === "yearly" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                          <span style={{
                            fontFamily: "'Figtree', sans-serif",
                            fontSize: "13px",
                            color: "#AAAAAA",
                            textDecoration: "line-through",
                          }}>
                            {paidPlan.yearlyFull.toLocaleString("cs-CZ")} Kč
                          </span>
                          <span style={{
                            fontFamily: "'Figtree', sans-serif",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#16A34A",
                            background: "rgba(22,163,74,0.10)",
                            borderRadius: "9999px",
                            padding: "2px 8px",
                          }}>
                            {lang === "cs"
                              ? `Ušetříte ${paidPlan.savingsPerYear.toLocaleString("cs-CZ")} Kč`
                              : `Save ${paidPlan.savingsPerYear.toLocaleString("en")} CZK`}
                          </span>
                        </div>
                      )}
                      {billing === "yearly" && (
                        <div style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: "12px",
                          color: "#AAAAAA",
                          marginTop: "4px",
                        }}>
                          ≈ {Math.round(displayPrice / 12).toLocaleString("cs-CZ")} Kč{t("pricing.perMonth")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "9px", flex: 1 }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <span style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1px",
                        color: feature.included
                          ? isFree ? "#888888" : "#3B82F6"
                          : "#DDDDDD",
                      }}>
                        {feature.included
                          ? <Check size={14} strokeWidth={2.5} />
                          : <X size={14} strokeWidth={2} />
                        }
                      </span>
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: "13.5px",
                        color: feature.included
                          ? isFree ? "#666666" : "#333333"
                          : "#C0C0C0",
                        lineHeight: 1.45,
                      }}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "24px" }}>
                  <Link href="/register">
                    <button
                      data-testid={`btn-cta-${plan.key}`}
                      style={{
                        width: "100%",
                        height: "44px",
                        borderRadius: "9999px",
                        background: isFree
                          ? "rgba(0,0,0,0.07)"
                          : "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                        color: isFree ? "#555555" : "#FFFFFF",
                        border: "none",
                        fontFamily: "'Figtree', sans-serif",
                        fontWeight: 600,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "opacity 0.15s ease, transform 0.15s ease",
                        boxShadow: isFree
                          ? "none"
                          : "0 4px 14px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      }}
                    >
                      {isFree ? t("pricing.free.cta") : t("pricing.pro.cta")}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{
          textAlign: "center",
          marginTop: "48px",
          fontFamily: "'Figtree', sans-serif",
          fontSize: "13px",
          color: "#888888",
          lineHeight: 1.7,
          whiteSpace: "pre-line",
        }}>
          {t("pricing.footerNote")}
        </div>
      </div>
    </div>
  );
}
