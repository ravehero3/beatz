import { useState } from "react";
import { Link } from "wouter";
import { Check, X } from "lucide-react";

const plans = {
  monthly: [
    {
      name: "Free",
      nameCz: "Zdarma",
      price: 0,
      period: "forever",
      highlight: false,
      badge: null,
      cta: "Start for free",
      ctaHref: "/register",
      features: [
        { text: "Up to 5 beats", included: true },
        { text: "Basic profile page", included: true },
        { text: "QR platba payments", included: true },
        { text: "Custom store design", included: false },
        { text: "Analytics", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      name: "Pro",
      price: 299,
      period: "month",
      highlight: true,
      badge: "Most popular",
      cta: "Start Pro",
      ctaHref: "/register",
      features: [
        { text: "Unlimited beats", included: true },
        { text: "Custom store design (3 templates)", included: true },
        { text: "Full analytics dashboard", included: true },
        { text: "QR platba + GoPay + Lemon Squeezy", included: true },
        { text: "Auto-generated invoices + licenses", included: true },
        { text: "Priority support", included: true },
        { text: "Custom store URL slug", included: true },
      ],
    },
    {
      name: "Pro+",
      nameSub: "Label",
      price: 799,
      period: "month",
      highlight: false,
      badge: null,
      cta: "Go Pro+",
      ctaHref: "/register",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Multiple artist profiles (up to 5)", included: true },
        { text: "White-label store (no Beatpack branding)", included: true },
        { text: "Fio API auto-confirmation", included: true },
        { text: "Custom domain support", included: true },
        { text: "Dedicated support", included: true },
      ],
    },
  ],
  yearly: [
    { name: "Free", nameCz: "Zdarma", price: 0, period: "forever", highlight: false, badge: null, cta: "Start for free", ctaHref: "/register", features: [{ text: "Up to 5 beats", included: true }, { text: "Basic profile page", included: true }, { text: "QR platba payments", included: true }, { text: "Custom store design", included: false }, { text: "Analytics", included: false }, { text: "Priority support", included: false }] },
    { name: "Pro", price: 2490, period: "year", highlight: true, badge: "Most popular", cta: "Start Pro", ctaHref: "/register", features: [{ text: "Unlimited beats", included: true }, { text: "Custom store design (3 templates)", included: true }, { text: "Full analytics dashboard", included: true }, { text: "QR platba + GoPay + Lemon Squeezy", included: true }, { text: "Auto-generated invoices + licenses", included: true }, { text: "Priority support", included: true }, { text: "Custom store URL slug", included: true }] },
    { name: "Pro+", nameSub: "Label", price: 6990, period: "year", highlight: false, badge: null, cta: "Go Pro+", ctaHref: "/register", features: [{ text: "Everything in Pro", included: true }, { text: "Multiple artist profiles (up to 5)", included: true }, { text: "White-label store (no Beatpack branding)", included: true }, { text: "Fio API auto-confirmation", included: true }, { text: "Custom domain support", included: true }, { text: "Dedicated support", included: true }] },
  ],
};

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const currentPlans = plans[billing];

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh", background: "#FFFFFF" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            color: "#0A0A0A",
            letterSpacing: "-0.03em",
            marginBottom: "12px",
          }}>Choose your plan</h1>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "16px", color: "#888888" }}>
            No contracts. Cancel anytime.
          </p>
          {/* Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0", marginTop: "28px", background: "#F2F2F2", borderRadius: "9999px", padding: "4px" }}>
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                data-testid={`btn-billing-${b}`}
                style={{
                  height: "34px",
                  padding: "0 20px",
                  borderRadius: "9999px",
                  border: "none",
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: billing === b ? "#FFFFFF" : "transparent",
                  color: billing === b ? "#0A0A0A" : "#888888",
                  boxShadow: billing === b ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                }}
              >
                {b === "monthly" ? "Monthly" : "Yearly"} {b === "yearly" && <span style={{ fontSize: "11px", color: "#22C55E" }}>Save 17%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start" }}>
          {currentPlans.map((plan) => (
            <div key={plan.name} style={{ position: "relative" }}>
              {plan.badge && (
                <div style={{
                  textAlign: "center",
                  marginBottom: "8px",
                }}>
                  <span style={{
                    background: "#0A0A0A",
                    color: "#FFFFFF",
                    padding: "4px 14px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontFamily: "'Figtree', sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}>{plan.badge}</span>
                </div>
              )}
              <div
                data-testid={`card-plan-${plan.name.toLowerCase()}`}
                style={{
                  background: "#FFFFFF",
                  border: plan.highlight ? "2px solid #0A0A0A" : "1px solid #E5E5E5",
                  borderRadius: "16px",
                  padding: "32px",
                  transform: plan.highlight ? "scale(1.02)" : "none",
                }}
              >
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "20px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>
                    {plan.name}{(plan as any).nameSub && <span style={{ fontWeight: 400, fontSize: "16px", color: "#888888" }}> / {(plan as any).nameSub}</span>}
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    {plan.price === 0 ? (
                      <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "32px", color: "#0A0A0A" }}>Free</span>
                    ) : (
                      <>
                        <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: "36px", color: "#0A0A0A", letterSpacing: "-0.03em" }}>
                          {plan.price.toLocaleString("cs-CZ")} Kč
                        </span>
                        <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>/{plan.period}</span>
                      </>
                    )}
                  </div>
                </div>

                <Link href={plan.ctaHref}>
                  <button
                    data-testid={`btn-cta-${plan.name.toLowerCase()}`}
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
                      marginBottom: "24px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {plan.cta}
                  </button>
                </Link>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {feature.included
                        ? <Check size={16} color="#22C55E" style={{ flexShrink: 0 }} />
                        : <X size={16} color="#D4D4D4" style={{ flexShrink: 0 }} />
                      }
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: "14px",
                        color: feature.included ? "#444444" : "#AAAAAA",
                      }}>{feature.text}</span>
                    </div>
                  ))}
                </div>
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
        }}>
          All plans include: GDPR-compliant, hosted in EU, cancel anytime,<br />
          automatic license PDF generation, buyer email notifications.
        </div>
      </div>
    </div>
  );
}
