import { useGetDashboardStats, useListWithdrawals } from "@workspace/api-client-react";
import StudioLayout from "./StudioLayout";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/lib/i18n";

const F = "'Figtree', sans-serif";

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    pending: "Čeká",
    processing: "Zpracovává se",
    paid: "Vyplaceno",
  };
  const colors: Record<string, { bg: string; color: string }> = {
    pending: { bg: "#FFFBEB", color: "#F59E0B" },
    processing: { bg: "#EFF6FF", color: "#3B82F6" },
    paid: { bg: "#F0FDF4", color: "#22C55E" },
  };
  const c = colors[status] ?? { bg: "#F2F2F2", color: "#888888" };
  return (
    <span style={{ padding: "3px 8px", borderRadius: "9999px", fontFamily: F, fontSize: "11px", fontWeight: 600, background: c.bg, color: c.color }}>
      {labels[status] ?? status}
    </span>
  );
}

export default function EarningsPage() {
  const t = useT();
  const { data: stats } = useGetDashboardStats();
  const { data: withdrawals, isLoading } = useListWithdrawals();

  return (
    <StudioLayout>
      <div style={{ padding: "32px" }}>
        <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "28px" }}>
          {t("studio.nav.earnings")}
        </h1>

        {/* Balance card — clean, no withdrawal button */}
        <div style={{ background: "#0A0A0A", borderRadius: "20px", padding: "32px", marginBottom: "24px" }}>
          <div style={{ fontFamily: F, fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>
            {t("earnings.balance")}
          </div>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: "42px", color: "#FFFFFF", letterSpacing: "-0.03em" }}>
            {formatCurrency(stats?.pendingBalance ?? 0)}
          </div>
          <div style={{ fontFamily: F, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "12px", lineHeight: 1.55 }}>
            {t("earnings.paymentNote")}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontFamily: F, fontSize: "12px", fontWeight: 500, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              {t("earnings.totalEarned")}
            </div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: "24px", color: "#0A0A0A" }}>
              {formatCurrency(stats?.totalEarned ?? 0)}
            </div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontFamily: F, fontSize: "12px", fontWeight: 500, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              {t("earnings.thisMonth")}
            </div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: "24px", color: "#0A0A0A" }}>
              {formatCurrency(stats?.earningsThisMonth ?? 0)}
            </div>
          </div>
        </div>

        {/* Withdrawal history */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: F, fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "16px" }}>
            {t("earnings.history")}
          </div>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} style={{ height: "44px" }} />)}
            </div>
          ) : (withdrawals ?? []).length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#888888", fontFamily: F, fontSize: "14px" }}>
              {t("earnings.noHistory")}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F2F2F2" }}>
                  {[t("earnings.date"), t("earnings.amount"), t("earnings.status")].map((h) => (
                    <th key={h} style={{ fontFamily: F, fontSize: "11px", fontWeight: 500, color: "#888888", textAlign: "left", paddingBottom: "10px", paddingRight: "16px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(withdrawals ?? []).map((w) => (
                  <tr key={w.id} style={{ borderBottom: "1px solid #F9F9F9" }}>
                    <td style={{ padding: "12px 16px 12px 0", fontFamily: F, fontSize: "13px", color: "#888888" }}>
                      {new Date(w.requestedAt).toLocaleDateString("cs-CZ")}
                    </td>
                    <td style={{ padding: "12px 16px 12px 0", fontFamily: F, fontWeight: 700, fontSize: "13px", color: "#0A0A0A" }}>
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
    </StudioLayout>
  );
}
