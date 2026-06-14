import { Link, useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";
import { useLogoutUser } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Music, Shield, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import beatpackLogo from "@assets/beatpack_logo_1_1781012889607.png";
import { useLanguageStore } from "@/store/languageStore";
import { useT } from "@/lib/i18n";

export default function Header() {
  const { user, logout } = useAuthStore();
  const logoutMutation = useLogoutUser();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggle } = useLanguageStore();
  const t = useT();

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        logout();
        queryClient.clear();
      },
    });
  }

  const navLinks = [
    { href: "/beats", label: t("nav.browse") },
    { href: "/artists", label: t("nav.artists") },
    { href: "/pricing", label: t("nav.pricing") },
  ];

  return (
    <>
      <header
        style={{
          height: "44px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #F2F2F2",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: "24px",
        }}
      >
        {/* Logo */}
        <Link href="/">
          <img
            src={beatpackLogo}
            alt="beatpack"
            data-testid="logo"
            style={{ display: "block" }}
            className="h-[17px] md:h-[20px]"
          />
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                color: location.startsWith(link.href) ? "#0A0A0A" : "#444444",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              data-testid={`nav-${link.href.replace("/", "")}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          {/* Language toggle */}
          <button
            onClick={toggle}
            style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "#444444",
              background: "none",
              border: "1px solid #E5E5E5",
              borderRadius: "6px",
              cursor: "pointer",
              letterSpacing: "0.06em",
              padding: "2px 8px",
              height: "24px",
              lineHeight: "20px",
              transition: "border-color 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0A0A0A"; e.currentTarget.style.color = "#0A0A0A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.color = "#444444"; }}
            data-testid="language-toggle"
          >
            {lang === "en" ? "EN" : "CS"}
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#0A0A0A",
                  }}
                  data-testid="user-menu-trigger"
                >
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#F2F2F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <User size={14} color="#444" />
                  </div>
                  {user.firstName || user.email?.split("@")[0] || t("nav.account")}
                  <ChevronDown size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" style={{ minWidth: "180px" }}>
                <DropdownMenuItem asChild>
                  <Link href="/account" data-testid="menu-account">
                    <User size={14} className="mr-2" /> {t("nav.account")}
                  </Link>
                </DropdownMenuItem>
                {user.role === "buyer" && (
                  <DropdownMenuItem asChild>
                    <Link href="/become-a-seller" data-testid="menu-become-seller">
                      <Music size={14} className="mr-2" /> {t("nav.sell")}
                    </Link>
                  </DropdownMenuItem>
                )}
                {(user.role === "artist" || user.role === "admin") && (
                  <DropdownMenuItem asChild>
                    <Link href="/studio" data-testid="menu-studio">
                      <Music size={14} className="mr-2" /> {t("nav.studio")}
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" data-testid="menu-admin">
                      <Shield size={14} className="mr-2" /> {t("nav.admin")}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                  <LogOut size={14} className="mr-2" /> {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <button
                  style={{
                    height: "32px",
                    padding: "0 16px",
                    borderRadius: "9999px",
                    background: "none",
                    border: "1px solid #E5E5E5",
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#0A0A0A",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                  data-testid="btn-login"
                >
                  {t("nav.login")}
                </button>
              </Link>
              <Link href="/register">
                <button
                  style={{
                    height: "32px",
                    padding: "0 16px",
                    borderRadius: "9999px",
                    background: "#0A0A0A",
                    border: "none",
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                  data-testid="btn-register"
                >
                  {t("nav.signup")}
                </button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "44px",
            left: 0,
            right: 0,
            background: "#FFFFFF",
            borderBottom: "1px solid #E5E5E5",
            padding: "16px 24px",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 500,
                fontSize: "15px",
                color: "#0A0A0A",
                textDecoration: "none",
                padding: "10px 0",
                borderBottom: "1px solid #F2F2F2",
              }}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div style={{ display: "flex", gap: "8px", paddingTop: "12px" }}>
              <Link href="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>
                <button style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "9999px",
                  background: "none",
                  border: "1px solid #E5E5E5",
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#0A0A0A",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>
                  {t("nav.login")}
                </button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>
                <button style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "9999px",
                  background: "#0A0A0A",
                  border: "none",
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>
                  {t("nav.signup")}
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
