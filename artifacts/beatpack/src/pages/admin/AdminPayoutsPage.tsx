import { useListWithdrawals, useMarkWithdrawalPaid, getListWithdrawalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./AdminLayout";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";

export default function AdminPayoutsPage() {
  const queryClient = useQueryClient();
  const { data: withdrawals, isLoading } = useListWithdrawals();
  const markPaid = useMarkWithdrawalPaid();

  const statusColor = (s: string) => {
    if (s === "paid") return { bg: "#F0FDF4", color: "#22C55E" };
    if (s === "processing") return { bg: "#EFF6FF", color: "#3B82F6" };
    return { bg: "#FFFBEB", color: "#F59E0B" };
  };

  return (
    <AdminLayout>
      <div style={{ padding: "32px" }}>
        <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "28px" }}>Payouts</h1>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden" }}>
          {isLoading ? (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} style={{ height: "48px" }} />)}
            </div>
          ) : (withdrawals ?? []).length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 24px" }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "8px" }}>No payout requests</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F2F2F2", background: "#F9F9F9" }}>
                  {["Artist", "Amount", "Requested", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 500, color: "#888888", textAlign: "left", padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(withdrawals ?? []).map((w) => {
                  const sc = statusColor(w.status);
                  return (
                    <tr key={w.id} data-testid={`row-payout-${w.id}`} style={{ borderBottom: "1px solid #F2F2F2" }}>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: "#0A0A0A" }}>{w.artistName ?? "—"}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "13px", color: "#0A0A0A" }}>{formatCurrency(Number(w.amountCzk))}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888" }}>{new Date(w.requestedAt).toLocaleDateString("cs-CZ")}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: "9999px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 600, background: sc.bg, color: sc.color }}>{w.status}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {w.status === "pending" && (
                          <button
                            onClick={() => markPaid.mutate({ id: w.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListWithdrawalsQueryKey() }) })}
                            data-testid={`btn-mark-paid-${w.id}`}
                            style={{ height: "30px", padding: "0 12px", borderRadius: "9999px", background: "#F0FDF4", color: "#22C55E", border: "1px solid #86EFAC", fontFamily: "'Figtree', sans-serif", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                          >
                            <CheckCircle size={12} /> Mark as paid
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
    </AdminLayout>
  );
}
