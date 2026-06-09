import { useGetPlatformStats, useListWithdrawals } from "@workspace/api-client-react";
import AdminLayout from "./AdminLayout";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetPlatformStats();
  const { data: withdrawals } = useListWithdrawals();
  const pendingWithdrawals = (withdrawals ?? []).filter((w) => w.status === "pending");

  return (
    <AdminLayout>
      <div style={{ padding: "32px" }}>
        <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "28px" }}>Platform Overview</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {isLoading ? (
            Array(5).fill(0).map((_, i) => <Skeleton key={i} style={{ height: "88px", borderRadius: "16px" }} />)
          ) : [
            { label: "Total Users", value: (stats?.totalUsers ?? 0).toLocaleString("cs-CZ") },
            { label: "Total Artists", value: (stats?.totalArtists ?? 0).toLocaleString("cs-CZ") },
            { label: "Total Beats", value: (stats?.totalBeats ?? 0).toLocaleString("cs-CZ") },
            { label: "Revenue This Month", value: formatCurrency(stats?.revenueThisMonth ?? 0) },
            { label: "Pending Payouts", value: stats?.pendingPayouts ?? 0 },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 500, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{stat.label}</div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: "24px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "15px", color: "#0A0A0A" }}>Pending Withdrawals</div>
              {pendingWithdrawals.length > 0 && (
                <span style={{ background: "#EF4444", color: "#FFFFFF", borderRadius: "9999px", padding: "2px 8px", fontFamily: "'Figtree', sans-serif", fontSize: "12px", fontWeight: 700 }}>{pendingWithdrawals.length}</span>
              )}
            </div>
            <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888", marginBottom: "16px" }}>{pendingWithdrawals.length === 0 ? "No pending withdrawals" : `${pendingWithdrawals.length} withdrawal${pendingWithdrawals.length > 1 ? "s" : ""} waiting for payment`}</p>
            <Link href="/admin/payouts" style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 600, color: "#0A0A0A", textDecoration: "none" }}>
              View payouts <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
