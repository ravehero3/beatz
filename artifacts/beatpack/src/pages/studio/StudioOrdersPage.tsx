import { useListMyOrders, useConfirmOrder, getListMyOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import StudioLayout from "./StudioLayout";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";

export default function StudioOrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useListMyOrders();
  const confirmOrder = useConfirmOrder();

  function handleConfirm(id: string) {
    confirmOrder.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMyOrdersQueryKey() }),
    });
  }

  const statusColor = (s: string) => {
    if (s === "paid") return { bg: "#F0FDF4", color: "#22C55E" };
    if (s === "failed") return { bg: "#FEF2F2", color: "#EF4444" };
    return { bg: "#FFFBEB", color: "#F59E0B" };
  };

  return (
    <StudioLayout>
      <div style={{ padding: "32px" }}>
        <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "28px" }}>Orders</h1>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden" }}>
          {isLoading ? (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} style={{ height: "48px" }} />)}
            </div>
          ) : (orders ?? []).length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 24px" }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "8px" }}>No orders yet</div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>Orders will appear here when buyers purchase your beats.</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F2F2F2", background: "#F9F9F9" }}>
                  {["Beat", "License", "Amount", "Status", "Date", "Action"].map((h) => (
                    <th key={h} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 500, color: "#888888", textAlign: "left", padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(orders ?? []).map((order) => {
                  const sc = statusColor(order.paymentStatus);
                  return (
                    <tr key={order.id} data-testid={`row-order-${order.id}`} style={{ borderBottom: "1px solid #F2F2F2" }}>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: "#0A0A0A" }}>{order.beat?.title ?? "—"}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888", textTransform: "capitalize" }}>{order.licenseType}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "13px", color: "#0A0A0A" }}>{formatCurrency(Number(order.amountCzk))}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: "9999px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 600, background: sc.bg, color: sc.color }}>{order.paymentStatus}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888" }}>{new Date(order.createdAt).toLocaleDateString("cs-CZ")}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {order.paymentStatus === "pending" && (
                          <button
                            onClick={() => handleConfirm(order.id)}
                            data-testid={`btn-confirm-order-${order.id}`}
                            style={{ height: "30px", padding: "0 12px", borderRadius: "9999px", background: "#F0FDF4", color: "#22C55E", border: "1px solid #86EFAC", fontFamily: "'Figtree', sans-serif", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                          >
                            <CheckCircle size={12} /> Confirm payment
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </StudioLayout>
  );
}
