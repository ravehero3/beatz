import { useState } from "react";
import { useGetDashboardStats, useListWithdrawals, useCreateWithdrawal, getListWithdrawalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import StudioLayout from "./StudioLayout";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    pending: { bg: "#FFFBEB", color: "#F59E0B" },
    processing: { bg: "#EFF6FF", color: "#3B82F6" },
    paid: { bg: "#F0FDF4", color: "#22C55E" },
  };
  const c = colors[status] ?? { bg: "#F2F2F2", color: "#888888" };
  return (
    <span style={{ padding: "3px 8px", borderRadius: "9999px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 600, background: c.bg, color: c.color }}>
      {status}
    </span>
  );
}

export default function EarningsPage() {
  const queryClient = useQueryClient();
  const { data: stats } = useGetDashboardStats();
  const { data: withdrawals, isLoading } = useListWithdrawals();
  const createWithdrawal = useCreateWithdrawal();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");

  function handleWithdraw() {
    createWithdrawal.mutate({ data: { amountCzk: Number(amount) } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListWithdrawalsQueryKey() });
        setShowModal(false);
        setAmount("");
      },
    });
  }

  return (
    <StudioLayout>
      <div style={{ padding: "32px" }}>
        <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "28px" }}>Earnings</h1>

        {/* Balance card */}
        <div style={{ background: "#0A0A0A", borderRadius: "20px", padding: "32px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>Available Balance</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: "38px", color: "#FFFFFF", letterSpacing: "-0.03em" }}>
              {formatCurrency(stats?.pendingBalance ?? 0)}
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            data-testid="btn-request-withdrawal"
            style={{ height: "44px", padding: "0 24px", borderRadius: "9999px", background: "#FFFFFF", color: "#0A0A0A", border: "none", fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}
          >
            Request Withdrawal
          </button>
        </div>

        {/* All-time stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", fontWeight: 500, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Total earned</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: "24px", color: "#0A0A0A" }}>{formatCurrency(stats?.totalEarned ?? 0)}</div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", fontWeight: 500, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>This month</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: "24px", color: "#0A0A0A" }}>{formatCurrency(stats?.earningsThisMonth ?? 0)}</div>
          </div>
        </div>

        {/* Withdrawal history */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "16px" }}>Withdrawal History</div>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} style={{ height: "44px" }} />)}
            </div>
          ) : (withdrawals ?? []).length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#888888", fontFamily: "'Figtree', sans-serif", fontSize: "14px" }}>No withdrawals yet</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F2F2F2" }}>
                  {["Date", "Amount", "Status"].map((h) => (
                    <th key={h} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 500, color: "#888888", textAlign: "left", paddingBottom: "10px", paddingRight: "16px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(withdrawals ?? []).map((w) => (
                  <tr key={w.id} data-testid={`row-withdrawal-${w.id}`} style={{ borderBottom: "1px solid #F9F9F9" }}>
                    <td style={{ padding: "12px 16px 12px 0", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888" }}>
                      {new Date(w.requestedAt).toLocaleDateString("cs-CZ")}
                    </td>
                    <td style={{ padding: "12px 16px 12px 0", fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "13px", color: "#0A0A0A" }}>
                      {formatCurrency(Number(w.amountCzk))}
                    </td>
                    <td style={{ padding: "12px 0" }}><StatusBadge status={w.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Withdrawal modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "24px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 24px 64px rgba(0,0,0,0.14)" }}>
            <h2 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "20px", color: "#0A0A0A", marginBottom: "8px" }}>Request Withdrawal</h2>
            <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888", marginBottom: "24px" }}>Available: {formatCurrency(stats?.pendingBalance ?? 0)}</p>
            <label style={{ display: "block", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "6px" }}>Amount (Kč)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={stats?.pendingBalance ?? 0}
              placeholder="Enter amount..."
              data-testid="input-withdrawal-amount"
              style={{ width: "100%", height: "44px", padding: "0 14px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "15px", outline: "none", boxSizing: "border-box", marginBottom: "20px" }}
              onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleWithdraw} disabled={!amount || createWithdrawal.isPending} data-testid="btn-confirm-withdrawal" style={{ flex: 1, height: "44px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: "'Figtree', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer", opacity: !amount ? 0.5 : 1 }}>
                {createWithdrawal.isPending ? "Requesting..." : "Request Withdrawal"}
              </button>
              <button onClick={() => setShowModal(false)} style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", background: "#FFFFFF", color: "#0A0A0A", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </StudioLayout>
  );
}
