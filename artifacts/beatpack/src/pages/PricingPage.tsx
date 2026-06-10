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
      background: "#F2F2F2",
      borderRadius: "9999px",
      padding: "3px",
      gap: "0",
    }}>
      {(["monthly", "yearly"] as const).map((b) => (
        <button
          key={b}
          onClick={() => setBilling(b)}
          style={{
            height: "26px",
            padding: "0 12px",
            borderRadius: "9999px",
            border: "none",
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 500,
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            background: billing === b ? "#FFFFFF" : "transparent",
            color: billing === b ? "#0A0A0A" : "#888888",
            boxShadow: billing === b ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
            whiteSpace: "nowrap",
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

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const t = useT();

  const plans = [
    {
      key: "free",
      name: "Free",
      price: 0,
      highlight: false,
      badge: null,
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
      highlight: true,
      badge: t("pricing.mostPopular"),
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
      highlight: false,
      badge: null,
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
    <div style={{ paddingTop: "44px", minHeight: "100vh", background: "#FFFFFF" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px" }}>
        {/* Header */}
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

        {/* Plan cards — equal height via stretch */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          alignItems: "stretch",
        }}>
          {plans.map((plan) => (
            <div
              key={plan.key}
              data-testid={`card-plan-${plan.key}`}
              style={{
                background: "#FFFFFF",
                border: plan.highlight ? "2px solid #0A0A0A" : "1px solid #E5E5E5",
                borderRadius: "20px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Card top: name + optional toggle */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "#0A0A0A",
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
                    {plan.badge && (
                      <span style={{
                        background: "#0A0A0A",
                        color: "#FFFFFF",
                        padding: "2px 10px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontFamily: "'Figtree', sans-serif",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                      }}>{plan.badge}</span>
                    )}
                  </div>
                  <div style={{ marginTop: "8px" }}>
                    {plan.price === 0 ? (
                      <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "30px", color: "#0A0A0A" }}>
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
                      <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888", marginLeft: "6px" }}>
                        {t("pricing.forever")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Per-card billing toggle (Pro + Pro+ only) */}
                {plan.hasBillingToggle && (
                  <BillingToggle billing={billing} setBilling={setBilling} t={t} />
                )}
              </div>

              {/* Features — flex:1 pushes CTA to bottom */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                {plan.features.map((feature, i) => {
                  const color = feature.included ? "#444444" : "#CCCCCC";
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

              {/* CTA at bottom */}
              <div style={{ marginTop: "24px" }}>
                <Link href={plan.ctaHref}>
                  <button
                    data-testid={`btn-cta-${plan.key}`}
                    style={{
                      width: "100%",
                      height: "44px",
                      borderRadius: "9999px",
                      background: plan.highlight ? "#0A0A0A" : "#FFFFFF",
                      color: plan.highlight ? "#FFFFFF" : "#0A0A0A",
                      border: plan.highlight ? "none" : "1px solid #E5E5E5",
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 500,
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!plan.highlight) e.currentTarget.style.borderColor = "#0A0A0A";
                    }}
                    onMouseLeave={(e) => {
                      if (!plan.highlight) e.currentTarget.style.borderColor = "#E5E5E5";
                    }}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            </div>
          ))}
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
