import { Link } from "wouter";
import { useAuthStore } from "@/store/authStore";
import { useListMyOrders } from "@workspace/api-client-react";
import { ShoppingBag, FileText, Heart, Settings, ArrowRight } from "lucide-react";

export default function AccountPage() {
  const { user } = useAuthStore();
  const { data: orders } = useListMyOrders();
  const recentOrders = (orders ?? []).slice(0, 3);

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh", background: "#F9F9F9" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "24px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "4px" }}>
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>{user?.email}</p>
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { href: "/account/orders", icon: <ShoppingBag size={20} />, label: "My Orders", desc: "Track purchases & payments" },
            { href: "/account/purchases", icon: <ShoppingBag size={20} />, label: "Downloads", desc: "Download purchased beats" },
            { href: "/account/licenses", icon: <FileText size={20} />, label: "Licenses", desc: "View license agreements" },
            { href: "/account/saved", icon: <Heart size={20} />, label: "Saved Beats", desc: "Your wishlist" },
            { href: "/account/settings", icon: <Settings size={20} />, label: "Settings", desc: "Account preferences" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                data-testid={`card-account-${item.label.toLowerCase().replace(/ /g, "-")}`}
                style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px", cursor: "pointer", transition: "box-shadow 0.2s ease", display: "flex", alignItems: "flex-start", gap: "14px" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#444444" }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "14px", color: "#0A0A0A" }}>{item.label}</div>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888", marginTop: "2px" }}>{item.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        {recentOrders.length > 0 && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "16px", color: "#0A0A0A" }}>Recent Purchases</div>
              <Link href="/account/purchases" style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888", textDecoration: "none" }}>View all <ArrowRight size={13} /></Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentOrders.map((order) => (
                <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F2F2F2" }}>
                  <div>
                    <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "14px", color: "#0A0A0A" }}>{order.beat?.title ?? "Beat"}</div>
                    <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888" }}>{order.licenseType} license</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "14px", color: "#0A0A0A" }}>{Number(order.amountCzk).toLocaleString("cs-CZ")} Kč</div>
                    <div style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: order.paymentStatus === "paid" ? "#F0FDF4" : "#FFFBEB",
                      color: order.paymentStatus === "paid" ? "#22C55E" : "#F59E0B",
                    }}>{order.paymentStatus}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
