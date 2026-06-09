import { Link } from "wouter";
import { useGetDashboardStats, useGetEarningsChart, useListMyOrders } from "@workspace/api-client-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Upload, ExternalLink } from "lucide-react";
import StudioLayout from "./StudioLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
      <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", fontWeight: 500, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: "26px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

export default function StudioDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: chartData, isLoading: chartLoading } = useGetEarningsChart();
  const { data: orders } = useListMyOrders();
  const recentOrders = (orders ?? []).slice(0, 5);

  return (
    <StudioLayout>
      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>Dashboard</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/studio/beats/upload">
              <button data-testid="btn-upload-beat" style={{ height: "36px", padding: "0 16px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <Upload size={14} /> Upload beat
              </button>
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {statsLoading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} style={{ height: "96px", borderRadius: "16px" }} />)
          ) : (
            <>
              <StatCard label="Earnings this month" value={formatCurrency(stats?.earningsThisMonth ?? 0)} />
              <StatCard label="Orders this month" value={stats?.ordersThisMonth ?? 0} />
              <StatCard label="Total plays" value={(stats?.totalPlays ?? 0).toLocaleString("cs-CZ")} />
              <StatCard label="Active beats" value={stats?.activeBeats ?? 0} />
            </>
          )}
        </div>

        {/* Earnings chart */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "20px" }}>Earnings — Last 30 Days</div>
          {chartLoading ? (
            <Skeleton style={{ height: "200px" }} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "'Figtree', sans-serif", fill: "#888888" }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11, fontFamily: "'Figtree', sans-serif", fill: "#888888" }} tickFormatter={(v) => `${v} Kč`} />
                <Tooltip formatter={(v) => [`${Number(v).toLocaleString("cs-CZ")} Kč`, "Earnings"]} labelStyle={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px" }} contentStyle={{ borderRadius: "8px", border: "1px solid #E5E5E5" }} />
                <Line type="monotone" dataKey="earnings" stroke="#0A0A0A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent orders */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "16px", color: "#0A0A0A" }}>Recent Orders</div>
            <Link href="/studio/orders" style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              View all <ExternalLink size={12} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#888888", fontFamily: "'Figtree', sans-serif", fontSize: "14px" }}>No orders yet</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F2F2F2" }}>
                  {["Beat", "License", "Amount", "Status"].map((h) => (
                    <th key={h} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", fontWeight: 500, color: "#888888", textAlign: "left", paddingBottom: "10px", paddingRight: "16px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #F9F9F9" }}>
                    <td style={{ padding: "12px 16px 12px 0", fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: "#0A0A0A" }}>{order.beat?.title ?? "—"}</td>
                    <td style={{ padding: "12px 16px 12px 0", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888", textTransform: "capitalize" }}>{order.licenseType}</td>
                    <td style={{ padding: "12px 16px 12px 0", fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "13px", color: "#0A0A0A" }}>{formatCurrency(Number(order.amountCzk))}</td>
                    <td style={{ padding: "12px 0" }}>
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: order.paymentStatus === "paid" ? "#F0FDF4" : "#FFFBEB",
                        color: order.paymentStatus === "paid" ? "#22C55E" : "#F59E0B",
                      }}>{order.paymentStatus}</span>
                    </td>
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
