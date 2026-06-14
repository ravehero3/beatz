import { useListMyOrders } from "@workspace/api-client-react";
import { FileText, Download, Music, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const F = "'Figtree', sans-serif";

const LICENSE_INFO: Record<string, { color: string; bg: string; rights: string[] }> = {
  basic: {
    color: "#444444", bg: "#F2F2F2",
    rights: ["Stream & distribute (free)", "Up to 10,000 streams", "MP3 delivery", "Must credit producer"],
  },
  premium: {
    color: "#6D28D9", bg: "#EDE9FE",
    rights: ["Commercial use", "Unlimited streams", "MP3 + WAV delivery", "Must credit producer"],
  },
  exclusive: {
    color: "#92400E", bg: "#FEF3C7",
    rights: ["Full exclusive rights", "Beat removed from store", "MP3 + WAV + stems", "No credit required"],
  },
};

export default function LicensesPage() {
  const { data: orders, isLoading } = useListMyOrders();
  const paidOrders = (orders ?? []).filter((o) => o.paymentStatus === "paid");

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh", background: "#F9F9F9" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "24px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "4px" }}>My Licenses</h1>
          <p style={{ fontFamily: F, fontSize: "14px", color: "#888888" }}>License agreements for your purchased beats.</p>
        </div>

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px" }}>
                <Skeleton style={{ height: "16px", width: "200px", marginBottom: "10px" }} />
                <Skeleton style={{ height: "12px", width: "60%" }} />
              </div>
            ))}
          </div>
        ) : paidOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "72px 24px", background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#AAAAAA" }}>
              <FileText size={24} />
            </div>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "6px" }}>No licenses yet</div>
            <div style={{ fontFamily: F, fontSize: "14px", color: "#888888", marginBottom: "20px" }}>Purchase a beat to get a license.</div>
            <Link href="/beats">
              <button style={{ height: "40px", padding: "0 20px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: F, fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                Browse Beats
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {paidOrders.map((order) => {
              const info = LICENSE_INFO[order.licenseType] ?? LICENSE_INFO.basic;
              const licenseLabel = order.licenseType.charAt(0).toUpperCase() + order.licenseType.slice(1);

              return (
                <div key={order.id} style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden" }}>
                  {/* Header */}
                  <div style={{ padding: "20px 24px", display: "flex", gap: "14px", alignItems: "center" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "10px", background: "#F2F2F2", overflow: "hidden", flexShrink: 0 }}>
                      {order.beat?.coverUrl
                        ? <img src={order.beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAAAAA" }}><Music size={18} /></div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F, fontWeight: 700, fontSize: "15px", color: "#0A0A0A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "4px" }}>
                        {order.beat?.title ?? "Beat"}
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ background: info.bg, color: info.color, borderRadius: "9999px", padding: "2px 10px", fontFamily: F, fontSize: "11px", fontWeight: 600 }}>
                          {licenseLabel} License
                        </span>
                        <span style={{ fontFamily: F, fontSize: "12px", color: "#888888" }}>
                          {new Date(order.createdAt).toLocaleDateString("cs-CZ", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span style={{ fontFamily: F, fontSize: "12px", color: "#AAAAAA" }}>
                          {formatCurrency(Number(order.amountCzk))}
                        </span>
                      </div>
                    </div>
                    {order.licensePdfUrl && (
                      <a href={order.licensePdfUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", height: "32px", padding: "0 12px", borderRadius: "9999px", background: "#F2F2F2", color: "#0A0A0A", textDecoration: "none", fontFamily: F, fontSize: "12px", fontWeight: 500, flexShrink: 0 }}>
                        <ExternalLink size={11} /> PDF
                      </a>
                    )}
                  </div>

                  {/* Rights */}
                  <div style={{ borderTop: "1px solid #F2F2F2", padding: "16px 24px", background: "#FAFAFA" }}>
                    <div style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Included rights</div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {info.rights.map((right) => (
                        <span key={right} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "9999px", fontFamily: F, fontSize: "12px", color: "#444444" }}>
                          ✓ {right}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
