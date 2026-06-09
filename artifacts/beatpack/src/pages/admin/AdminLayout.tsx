import { Link, useLocation } from "wouter";
import { BarChart2, Users, UserCheck, Music, CreditCard, DollarSign, Flag, Settings, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";

const navItems = [
  { href: "/admin", icon: <BarChart2 size={16} />, label: "Dashboard" },
  { href: "/admin/users", icon: <Users size={16} />, label: "Users" },
  { href: "/admin/artists", icon: <UserCheck size={16} />, label: "Artists" },
  { href: "/admin/beats", icon: <Music size={16} />, label: "Beats" },
  { href: "/admin/payouts", icon: <DollarSign size={16} />, label: "Payouts" },
  { href: "/admin/reports", icon: <Flag size={16} />, label: "Reports" },
  { href: "/admin/settings", icon: <Settings size={16} />, label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuthStore();

  return (
    <div style={{ paddingTop: "44px", display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "240px", flexShrink: 0, background: "#0A0A0A", position: "fixed", top: "44px", bottom: 0, left: 0, display: "flex", flexDirection: "column", overflowY: "auto", zIndex: 100 }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <img src={beatpackLogo} alt="beatpack" style={{ height: "18px", filter: "invert(1)" }} />
          <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "6px" }}>Admin Panel</div>
        </div>

        <nav style={{ padding: "8px", flex: 1 }}>
          {navItems.map((item) => {
            const isActive = item.href === "/admin" ? location === "/admin" : location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  data-testid={`nav-admin-${item.label.toLowerCase()}`}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", background: isActive ? "rgba(255,255,255,0.1)" : "transparent", fontFamily: "'Figtree', sans-serif", fontWeight: isActive ? 600 : 400, fontSize: "14px", color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.6)", cursor: "pointer", marginBottom: "2px", transition: "background 0.15s ease", textDecoration: "none" }}
                >
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
            <ArrowLeft size={12} /> Back to site
          </Link>
        </div>
      </div>

      <div style={{ marginLeft: "240px", flex: 1, background: "#F9F9F9", minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
