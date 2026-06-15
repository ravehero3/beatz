import { Link, useLocation } from "wouter";
import { BarChart2, Music, Package, DollarSign, Palette, User, Settings, ArrowLeft, Mail } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/lib/i18n";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuthStore();
  const t = useT();

  const navItems = [
    { href: "/studio", icon: <BarChart2 size={16} />, label: t("studio.nav.dashboard") },
    { href: "/studio/beats", icon: <Music size={16} />, label: t("studio.nav.beats") },
    { href: "/studio/orders", icon: <Package size={16} />, label: t("studio.nav.orders") },
    { href: "/studio/earnings", icon: <DollarSign size={16} />, label: t("studio.nav.earnings") },
    { href: "/studio/store", icon: <Palette size={16} />, label: t("studio.nav.store") },
    { href: "/studio/leads", icon: <Mail size={16} />, label: t("studio.nav.leads") },
    { href: "/studio/profile", icon: <User size={16} />, label: t("studio.nav.profile") },
    { href: "/studio/settings", icon: <Settings size={16} />, label: t("studio.nav.settings") },
  ];

  return (
    <div style={{ paddingTop: "44px", display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: "220px",
        flexShrink: 0,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "inset -1px 0 0 rgba(255,255,255,0.6)",
        position: "fixed",
        top: "44px",
        bottom: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        zIndex: 100,
      }}>
        <nav style={{ padding: "8px", flex: 1, paddingTop: "12px" }}>
          {navItems.map((item) => {
            const isActive = item.href === "/studio" ? location === "/studio" : location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  data-testid={`nav-studio-${item.href.replace("/studio/", "").replace("/studio", "dashboard")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: isActive ? "#F2F2F2" : "transparent",
                    fontFamily: "'Figtree', sans-serif",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "14px",
                    color: isActive ? "#0A0A0A" : "#444444",
                    cursor: "pointer",
                    marginBottom: "2px",
                    transition: "background 0.15s ease",
                    textDecoration: "none",
                  }}
                >
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #F2F2F2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
              {user?.firstName?.[0] ?? user?.email?.[0] ?? "?"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "12px", color: "#0A0A0A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : user?.email ?? ""}
              </div>
            </div>
          </div>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888", textDecoration: "none" }}>
            <ArrowLeft size={12} /> {t("studio.nav.back")}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: "220px", flex: 1, background: "#F9F9F9", minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
