import { useState } from "react";
import { Link } from "wouter";
import {
  Music2, User, CreditCard, Paintbrush, BarChart2, Headphones,
  Zap, FileText, Link2, Package, Users, Shield, Globe, MessageSquare,
} from "lucide-react";
import { useT } from "@/lib/i18n";

type BillingPeriod = "monthly" | "yearly";

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
      background: "#E0E0E0",
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
          boxShadow: "0 1px 4px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.06)",
          transition: "left 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
          pointerEvents: "none",
        }}
      />
      {(["monthly", "yearly"] as const).map((b) => (
        <button
          key={b}
          onClick={() => setBilling(b)}
          style={{
            height: "26px",
            padding: "0 14px",
            borderRadius: "9999px",
            border: "none",
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 500,
            fontSize: "12px",
            cursor: "pointer",
            background: "transparent",
            color: billing === b ? "#0A0A0A" : "#888888",
            whiteSpace: "nowrap",
            position: "relative",
            zIndex: 1,
            transition: "color 0.15s ease",
          }}
        >
          {b === "monthly" ? t("pricing.monthly") : t("pricing.yearly")}
          {b === "yearly" && billing === "yearly" && (
            <span style={{ marginLeft: "4px", fontSize: "10px", color: "#22C55E", fontWeight: 600 }}>
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
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [proplusHovered, setProplusHovered] = useState(false);
  const t = useT();

  const plans = [
    {
      key: "free",
      name: "Free",
      price: 0,
      hasBillingToggle: false,
      cta: t("pricing.free.cta"),
      ctaHref: "/register",
      features: [
        { text: t("pricing.free.f1"), icon: <Music2 size={14} />, included: true },
        { text: t("pricing.free.f2"), icon: <User size={14} />, included: true },
        { text: t("pricing.free.f3"), icon: <CreditCard size={14} />, included: true },
        { text: t("pricing.free.f4"), icon: <Paintbrush size={14} />, included: false },
        { text: t("pricing.free.f5"), icon: <BarChart2 size={14} />, included: false },
        { text: t("pricing.free.f6"), icon: <Headphones size={14} />, included: false },
      ],
    },
    {
      key: "pro",
      name: "Pro",
      price: billing === "monthly" ? 299 : 2490,
      hasBillingToggle: true,
      cta: t("pricing.pro.cta"),
      ctaHref: "/register",
      features: [
        { text: t("pricing.pro.f1"), icon: <Zap size={14} />, included: true },
        { text: t("pricing.pro.f2"), icon: <Paintbrush size={14} />, included: true },
        { text: t("pricing.pro.f3"), icon: <BarChart2 size={14} />, included: true },
        { text: t("pricing.pro.f4"), icon: <CreditCard size={14} />, included: true },
        { text: t("pricing.pro.f5"), icon: <FileText size={14} />, included: true },
        { text: t("pricing.pro.f6"), icon: <Headphones size={14} />, included: true },
        { text: t("pricing.pro.f7"), icon: <Link2 size={14} />, included: true },
      ],
    },
    {
      key: "proplus",
      name: "Pro+",
      nameSub: "Label",
      price: billing === "monthly" ? 799 : 6990,
      hasBillingToggle: true,
      cta: t("pricing.proplus.cta"),
      ctaHref: "/register",
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

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh", background: "linear-gradient(160deg, #FAFAFA 0%, #F3F4F8 50%, #FAFAFA 100%)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h1 style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            color: "#0A0A0A",
            letterSpacing: "-0.03em",
            marginBottom: "12px",
          }}>{t("pricing.title")}</h1>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "16px", color: "#888888" }}>
            {t("pricing.sub")}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          alignItems: "stretch",
        }}>
          {plans.map((plan) => {
            const isFree = plan.key === "free";
            const isPro = plan.key === "pro";
            const isProPlus = plan.key === "proplus";

            const cardStyle: React.CSSProperties = isFree
              ? {
                  background: "#F3F3F3",
                  border: "1px solid #E4E4E4",
                  borderRadius: "20px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                }
              : isPro
              ? {
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  borderRadius: "20px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 20px 50px rgba(59, 130, 246, 0.18), 0 4px 16px rgba(59, 130, 246, 0.08)",
                }
              : {
                  background: "rgba(248, 250, 255, 0.75)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(200, 215, 255, 0.6)",
                  borderRadius: "20px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 24px rgba(160, 180, 255, 0.15)",
                  position: "relative",
                  overflow: "visible",
                };

            return (
              <div
                key={plan.key}
                data-testid={`card-plan-${plan.key}`}
                style={cardStyle}
                onMouseEnter={isProPlus ? () => setProplusHovered(true) : undefined}
                onMouseLeave={isProPlus ? () => setProplusHovered(false) : undefined}
              >
                {isProPlus && proplusHovered && SPARKLE_POSITIONS.map((pos, i) => (
                  <SparkleIcon key={i} style={{ position: "absolute", ...pos }} />
                ))}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontWeight: 700,
                        fontSize: "18px",
                        color: isFree ? "#555555" : "#0A0A0A",
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
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      {plan.price === 0 ? (
                        <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "30px", color: "#666666" }}>
                          {t("pricing.freeLabel")}
                        </span>
                      ) : (
                        <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: "32px", color: "#0A0A0A", letterSpacing: "-0.03em" }}>
                          {plan.price.toLocaleString("cs-CZ")} Kč
                          <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 400, color: "#888888", marginLeft: "4px" }}>
                            {billing === "monthly" ? t("pricing.perMonth") : t("pricing.perYear")}
                          </span>
                        </span>
                      )}
                      {plan.price === 0 && (
                        <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#999999", marginLeft: "6px" }}>
                          {t("pricing.forever")}
                        </span>
                      )}
                    </div>
                  </div>

                  {plan.hasBillingToggle && (
                    <BillingToggle billing={billing} setBilling={setBilling} t={t} />
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                  {plan.features.map((feature, i) => {
                    const color = feature.included
                      ? isFree ? "#666666" : "#444444"
                      : "#CCCCCC";
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color, flexShrink: 0, display: "flex", alignItems: "center" }}>
                          {feature.icon}
                        </span>
                        <span style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: "13.5px",
                          color,
                          lineHeight: 1.4,
                        }}>
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: "24px" }}>
                  <Link href={plan.ctaHref}>
                    <button
                      data-testid={`btn-cta-${plan.key}`}
                      style={{
                        width: "100%",
                        height: "44px",
                        borderRadius: "9999px",
                        background: isFree ? "#E8E8E8" : isPro ? "#0A0A0A" : "linear-gradient(135deg, #6366F1, #3B82F6)",
                        color: isFree ? "#555555" : "#FFFFFF",
                        border: "none",
                        fontFamily: "'Figtree', sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (isFree) e.currentTarget.style.background = "#DEDEDE";
                        if (isPro) e.currentTarget.style.opacity = "0.88";
                        if (isProPlus) e.currentTarget.style.opacity = "0.88";
                      }}
                      onMouseLeave={(e) => {
                        if (isFree) e.currentTarget.style.background = "#E8E8E8";
                        if (isPro) e.currentTarget.style.opacity = "1";
                        if (isProPlus) e.currentTarget.style.opacity = "1";
                      }}
                    >
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

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
