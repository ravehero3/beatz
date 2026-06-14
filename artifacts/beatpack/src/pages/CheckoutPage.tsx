import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useGetBeat, getGetBeatQueryKey, useCreateOrder, useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, AlertCircle, Copy, Download } from "lucide-react";
import QRCode from "@/components/QRCode";

function useQuery() {
  const [location] = useLocation();
  const search = location.split("?")[1] ?? "";
  return new URLSearchParams(search);
}

export default function CheckoutPage() {
  const query = useQuery();
  const beatId = query.get("beatId") ?? "";
  const licenseType = query.get("license") ?? "basic";
  const { user } = useAuthStore();
  const [, setLocation] = useLocation();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("qr_bank");

  const { data: beat, isLoading: beatLoading } = useGetBeat(beatId, {
    query: { enabled: !!beatId, queryKey: getGetBeatQueryKey(beatId) },
  });
  const createOrder = useCreateOrder();
  const { data: order } = useGetOrder(orderId ?? "", {
    query: { enabled: !!orderId, queryKey: getGetOrderQueryKey(orderId ?? ""), refetchInterval: 15000 },
  });

  useEffect(() => {
    if (!user) setLocation("/login");
  }, [user]);

  function handleCompleteOrder() {
    createOrder.mutate(
      { data: { beatId, licenseType, paymentMethod } },
      { onSuccess: (result) => setOrderId(result.id) }
    );
  }

  const licenseNames: Record<string, string> = { basic: "Basic License", premium: "Premium License", exclusive: "Exclusive License" };
  const priceKey = licenseType === "basic" ? "priceBasic" : licenseType === "premium" ? "pricePremium" : "priceExclusive";
  const price = beat ? Number((beat as any)[priceKey] ?? 0) : 0;

  if (beatLoading) {
    return <div style={{ paddingTop: "44px", maxWidth: "600px", margin: "0 auto", padding: "80px 24px" }}><Skeleton style={{ height: "300px", borderRadius: "16px" }} /></div>;
  }

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh", background: "#F9F9F9" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "24px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "32px" }}>
          {orderId ? "Complete Payment" : "Checkout"}
        </h1>

        {!orderId ? (
          <>
            {/* Order summary */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "14px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>Order Summary</div>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "8px", background: "#F2F2F2", overflow: "hidden", flexShrink: 0 }}>
                  {beat?.coverUrl && <img src={beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "16px", color: "#0A0A0A" }}>{beat?.title}</div>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888", marginTop: "4px" }}>{licenseNames[licenseType]}</div>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: "22px", color: "#0A0A0A", marginTop: "8px" }}>{formatCurrency(price)}</div>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "14px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>Payment Method</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[{ id: "qr_bank", label: "QR Platba — bank transfer", desc: "Scan QR code with your banking app (Czech banks)" }].map((m) => (
                  <label key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", border: `2px solid ${paymentMethod === m.id ? "#0A0A0A" : "#E5E5E5"}`, borderRadius: "10px", cursor: "pointer" }}>
                    <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} style={{ marginTop: "2px" }} />
                    <div>
                      <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "14px", color: "#0A0A0A" }}>{m.label}</div>
                      <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888", marginTop: "2px" }}>{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleCompleteOrder}
              disabled={createOrder.isPending}
              data-testid="btn-complete-order"
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "9999px",
                background: "#0A0A0A",
                color: "#FFFFFF",
                border: "none",
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                cursor: createOrder.isPending ? "not-allowed" : "pointer",
                opacity: createOrder.isPending ? 0.6 : 1,
              }}
            >
              {createOrder.isPending ? "Creating order..." : `Complete order — ${formatCurrency(price)}`}
            </button>
          </>
        ) : (
          /* QR Payment display */
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
            {/* Status */}
            <div style={{ marginBottom: "24px" }}>
              {order?.paymentStatus === "paid" ? (
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "8px 16px", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "9999px" }}>
                  <CheckCircle2 size={16} color="#22C55E" />
                  <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", fontWeight: 600, color: "#22C55E" }}>Payment confirmed</span>
                </div>
              ) : order?.paymentStatus === "failed" ? (
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "8px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "9999px" }}>
                  <AlertCircle size={16} color="#EF4444" />
                  <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", fontWeight: 600, color: "#EF4444" }}>Payment failed</span>
                </div>
              ) : (
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "8px 16px", background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "9999px" }}>
                  <Clock size={16} color="#F59E0B" />
                  <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", fontWeight: 600, color: "#F59E0B" }}>Waiting for payment...</span>
                </div>
              )}
            </div>

            {/* Real QR Code */}
            <div style={{ margin: "0 auto 24px" }}>
              {order?.qrCodeData ? (
                <QRCode
                  data={order.qrCodeData}
                  size={220}
                  label="Scan with your banking app (Czech banks)"
                />
              ) : (
                <div style={{ width: "220px", height: "220px", background: "#F2F2F2", borderRadius: "16px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ fontSize: "36px" }}>QR</span>
                  <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#AAAAAA", textAlign: "center", padding: "0 16px" }}>
                    Artist has not set up a bank account yet
                  </span>
                </div>
              )}
            </div>

            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: "28px", color: "#0A0A0A", marginBottom: "8px" }}>
              {formatCurrency(price)}
            </div>

            {order?.variableSymbol && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
                <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>Variable symbol:</span>
                <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "14px", color: "#0A0A0A" }}>{order.variableSymbol}</span>
                <button onClick={() => navigator.clipboard.writeText(order.variableSymbol ?? "")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888" }}>
                  <Copy size={14} />
                </button>
              </div>
            )}

            {order?.paymentStatus !== "paid" && (
              <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888", lineHeight: 1.6, maxWidth: "360px", margin: "0 auto 24px" }}>
                Scan the QR code with your Czech banking app or transfer manually using the variable symbol above. This page refreshes automatically every 15 seconds.
              </p>
            )}

            {order?.paymentStatus === "paid" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => setLocation("/account/orders")}
                  data-testid="btn-view-purchases"
                  style={{ height: "44px", padding: "0 24px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: "'Figtree', sans-serif", fontWeight: 500, fontSize: "14px", cursor: "pointer" }}
                >
                  View my orders
                </button>
                {(order as any).licensePdfUrl && (
                  <a
                    href={(order as any).licensePdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 16px", borderRadius: "9999px", background: "#F2F2F2", color: "#444", textDecoration: "none", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500 }}
                  >
                    <Download size={13} /> Download License PDF
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
