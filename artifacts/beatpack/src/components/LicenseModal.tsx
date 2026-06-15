import { useLocation } from "wouter";
import { Check, X, Music, Star, Crown } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface Beat {
  id: string;
  title: string;
  priceBasic?: number | null;
  pricePremium?: number | null;
  priceExclusive?: number | null;
  artistName?: string | null;
}

interface LicenseModalProps {
  beat: Beat;
  open: boolean;
  onClose: () => void;
}

const F = "'Figtree', sans-serif";

interface LicenseOption {
  key: "basic" | "premium" | "exclusive";
  name: string;
  tagline: string;
  icon: React.ReactNode;
  price: number | null | undefined;
  color: string;
  features: string[];
  limitations: string[];
}

export default function LicenseModal({ beat, open, onClose }: LicenseModalProps) {
  const [, setLocation] = useLocation();

  if (!open) return null;

  const licenses: LicenseOption[] = [
    {
      key: "basic",
      name: "Basic",
      tagline: "For personal & non-commercial use",
      icon: <Music size={18} />,
      price: beat.priceBasic,
      color: "#6B7280",
      features: [
        "MP3 file (320kbps)",
        "Non-commercial use only",
        "Up to 5,000 streams",
        "Must credit producer",
        "No radio broadcasting",
      ],
      limitations: [
        "No commercial release",
        "No sync licensing",
      ],
    },
    {
      key: "premium",
      name: "Premium",
      tagline: "For commercial releases & radio",
      icon: <Star size={18} />,
      price: beat.pricePremium,
      color: "#3B82F6",
      features: [
        "MP3 + WAV files (untagged)",
        "Commercial use allowed",
        "Up to 500,000 streams",
        "Radio broadcasting allowed",
        "Music video rights",
        "Must credit producer",
      ],
      limitations: [
        "Non-exclusive (others can buy)",
      ],
    },
    {
      key: "exclusive",
      name: "Exclusive",
      tagline: "Full ownership — beat leaves store",
      icon: <Crown size={18} />,
      price: beat.priceExclusive,
      color: "#F59E0B",
      features: [
        "MP3 + WAV + All stems",
        "Unlimited commercial use",
        "Unlimited streams",
        "No credit required",
        "Full sync & broadcast rights",
        "Beat removed from store",
        "Full ownership transfer",
      ],
      limitations: [],
    },
  ];

  function handleBuy(licenseKey: string) {
    onClose();
    setLocation(`/checkout?beatId=${beat.id}&license=${licenseKey}`);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          width: "100%", maxWidth: "820px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.12)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid #F0F0F0",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px",
        }}>
          <div>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "20px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "2px" }}>
              Choose a license
            </h2>
            <p style={{ fontFamily: F, fontSize: "13px", color: "#888888" }}>
              <span style={{ fontWeight: 600, color: "#444" }}>{beat.title}</span>
              {beat.artistName ? ` · ${beat.artistName}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "#F5F5F5", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#E5E5E5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#F5F5F5"; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* License cards */}
        <div style={{
          padding: "20px 24px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}>
          {licenses.map((lic) => {
            const hasPrice = lic.price != null && Number(lic.price) > 0;
            return (
              <div
                key={lic.key}
                style={{
                  border: `1.5px solid ${lic.color}22`,
                  borderRadius: "16px",
                  padding: "20px",
                  display: "flex", flexDirection: "column",
                  position: "relative",
                  background: "#FAFAFA",
                  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = lic.color;
                  el.style.boxShadow = `0 4px 20px ${lic.color}22`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${lic.color}22`;
                  el.style.boxShadow = "none";
                }}
              >
                {/* Icon + name */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "10px",
                    background: `${lic.color}15`,
                    color: lic.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {lic.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 700, fontSize: "15px", color: "#0A0A0A" }}>{lic.name}</div>
                  </div>
                </div>

                <p style={{ fontFamily: F, fontSize: "12px", color: "#888888", marginBottom: "14px", lineHeight: 1.45 }}>
                  {lic.tagline}
                </p>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, marginBottom: "16px" }}>
                  {lic.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                      <Check size={12} style={{ flexShrink: 0, marginTop: "2px", color: lic.color }} strokeWidth={2.5} />
                      <span style={{ fontFamily: F, fontSize: "12px", color: "#444444", lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                  {lic.limitations.map((l) => (
                    <div key={l} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                      <X size={12} style={{ flexShrink: 0, marginTop: "2px", color: "#CCCCCC" }} strokeWidth={2} />
                      <span style={{ fontFamily: F, fontSize: "12px", color: "#AAAAAA", lineHeight: 1.4 }}>{l}</span>
                    </div>
                  ))}
                </div>

                {/* Price + CTA */}
                <div>
                  {hasPrice ? (
                    <>
                      <div style={{ fontFamily: F, fontWeight: 800, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.03em", marginBottom: "10px" }}>
                        {formatCurrency(Number(lic.price))}
                      </div>
                      <button
                        onClick={() => handleBuy(lic.key)}
                        style={{
                          width: "100%", height: "40px", borderRadius: "9999px",
                          background: lic.color, color: "#FFFFFF", border: "none",
                          fontFamily: F, fontWeight: 600, fontSize: "13px",
                          cursor: "pointer",
                          transition: "opacity 0.15s ease, transform 0.15s ease",
                          boxShadow: `0 4px 14px ${lic.color}44`,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                      >
                        Buy {lic.name}
                      </button>
                    </>
                  ) : (
                    <div style={{ fontFamily: F, fontSize: "13px", color: "#AAAAAA", fontStyle: "italic" }}>
                      Not available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{ padding: "0 28px 20px" }}>
          <p style={{ fontFamily: F, fontSize: "11px", color: "#AAAAAA", textAlign: "center", lineHeight: 1.5 }}>
            All licenses include a digitally signed PDF contract. Payments are processed via QR platba or card.
          </p>
        </div>
      </div>
    </div>
  );
}
