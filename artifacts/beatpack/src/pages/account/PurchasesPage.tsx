import { useListMyOrders } from "@workspace/api-client-react";
import { Download, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

export default function PurchasesPage() {
  const { data: orders, isLoading } = useListMyOrders();
  const paidOrders = (orders ?? []).filter((o) => o.paymentStatus === "paid");

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh", background: "#F9F9F9" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "24px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "32px" }}>My Purchases</h1>

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
                <Skeleton style={{ height: "16px", width: "200px", marginBottom: "8px" }} />
                <Skeleton style={{ height: "12px", width: "120px" }} />
              </div>
            ))}
          </div>
        ) : paidOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>♪</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "8px" }}>No purchases yet</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>Browse beats and find something you love.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {paidOrders.map((order) => (
              <div key={order.id} data-testid={`row-purchase-${order.id}`} style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px", display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "8px", background: "#F2F2F2", overflow: "hidden", flexShrink: 0 }}>
                  {order.beat?.coverUrl && <img src={order.beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "15px", color: "#0A0A0A" }}>{order.beat?.title ?? "Beat"}</div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    <span style={{ background: "#F2F2F2", borderRadius: "9999px", padding: "2px 8px", fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#444444" }}>{order.licenseType}</span>
                    <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888" }}>{formatCurrency(Number(order.amountCzk))}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {order.beat?.audioPreviewUrl && (
                    <a href={order.beat.audioPreviewUrl} download style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", textDecoration: "none" }} data-testid={`btn-download-${order.id}`}>
                      <Download size={14} /> Download
                    </a>
                  )}
                  {order.licensePdfUrl && (
                    <a href={order.licensePdfUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", borderRadius: "9999px", background: "#FFFFFF", color: "#0A0A0A", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", textDecoration: "none" }} data-testid={`btn-license-${order.id}`}>
                      <FileText size={14} /> License
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
