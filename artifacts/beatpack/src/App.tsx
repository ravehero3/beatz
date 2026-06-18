import React from "react";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import BrowseBeatsPage from "@/pages/BrowseBeatsPage";
import BeatDetailPage from "@/pages/BeatDetailPage";
import ArtistsPage from "@/pages/ArtistsPage";
import ArtistStorePage from "@/pages/ArtistStorePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import PricingPage from "@/pages/PricingPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AccountPage from "@/pages/account/AccountPage";
import PurchasesPage from "@/pages/account/PurchasesPage";
import SavedPage from "@/pages/account/SavedPage";
import OrdersPage from "@/pages/account/OrdersPage";
import AccountSettingsPage from "@/pages/account/AccountSettingsPage";
import LicensesPage from "@/pages/account/LicensesPage";
import StudioDashboard from "@/pages/studio/StudioDashboard";
import MyBeatsPage from "@/pages/studio/MyBeatsPage";
import UploadBeatPage from "@/pages/studio/UploadBeatPage";
import EditBeatPage from "@/pages/studio/EditBeatPage";
import EarningsPage from "@/pages/studio/EarningsPage";
import StudioOrdersPage from "@/pages/studio/StudioOrdersPage";
import StoreSettingsPage from "@/pages/studio/StoreSettingsPage";
import StudioPageBuilder from "@/pages/studio/StudioPageBuilder";
import StudioLeadsPage from "@/pages/studio/StudioLeadsPage";
import StudioProfilePage from "@/pages/studio/StudioProfilePage";
import StudioSettingsPage from "@/pages/studio/StudioSettingsPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminBeatsPage from "@/pages/admin/AdminBeatsPage";
import AdminPayoutsPage from "@/pages/admin/AdminPayoutsPage";
import AdminStorefrontsPage from "@/pages/admin/AdminStorefrontsPage";
import AdminEmailsPage from "@/pages/admin/AdminEmailsPage";
import GoogleCallbackPage from "@/pages/GoogleCallbackPage";
import OnboardingPage from "@/pages/OnboardingPage";
import ProfileSetupPage from "@/pages/ProfileSetupPage";
import BecomeSellerPage from "@/pages/BecomeSellerPage";
import BottomPlayer from "@/components/BottomPlayer";

const F = "'Figtree', sans-serif";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message ?? "Unknown error" };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9F9F9", padding: "24px" }}>
          <div style={{ textAlign: "center", maxWidth: "420px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: "20px", color: "#0A0A0A", marginBottom: "8px", letterSpacing: "-0.02em" }}>
              Something went wrong
            </h2>
            <p style={{ fontFamily: F, fontSize: "14px", color: "#888888", marginBottom: "8px", lineHeight: 1.6 }}>
              An unexpected error occurred. Refreshing usually fixes it.
            </p>
            {this.state.message && (
              <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#AAAAAA", marginBottom: "24px", wordBreak: "break-word" }}>
                {this.state.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                height: "40px", padding: "0 28px", borderRadius: "9999px",
                background: "#0A0A0A", color: "#FFFFFF", border: "none",
                fontFamily: F, fontWeight: 600, fontSize: "14px", cursor: "pointer",
              }}
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ component: Component, roles }: { component: React.ComponentType; roles?: string[] }) {
  const { user, _hasHydrated } = useAuthStore();
  if (!_hasHydrated) return null;
  if (!user) return <Redirect to="/login" />;
  if (roles && !roles.includes(user.role)) return <Redirect to="/" />;
  return <Component />;
}

function PublicOnlyRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, _hasHydrated } = useAuthStore();
  if (!_hasHydrated) return null;
  if (user) return <Redirect to="/" />;
  return <Component />;
}

function OnboardingRoute() {
  const { user, _hasHydrated } = useAuthStore();
  if (!_hasHydrated) return null;
  if (!user) return <Redirect to="/register" />;
  return <OnboardingPage />;
}

function AppRouter() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={HomePage} />
      <Route path="/beats" component={BrowseBeatsPage} />
      <Route path="/beats/:id" component={BeatDetailPage} />
      <Route path="/artists" component={ArtistsPage} />
      <Route path="/artists/:slug" component={ArtistStorePage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/login" component={() => <PublicOnlyRoute component={LoginPage} />} />
      <Route path="/register" component={() => <PublicOnlyRoute component={RegisterPage} />} />
      <Route path="/forgot-password" component={() => <PublicOnlyRoute component={ForgotPasswordPage} />} />
      <Route path="/reset-password" component={ResetPasswordPage} />

      {/* Onboarding */}
      <Route path="/onboarding" component={OnboardingRoute} />
      <Route path="/profile-setup/:type" component={() => <ProtectedRoute component={ProfileSetupPage} />} />

      {/* Protected: buyers */}
      <Route path="/checkout" component={() => <ProtectedRoute component={CheckoutPage} />} />
      <Route path="/account" component={() => <ProtectedRoute component={AccountPage} />} />
      <Route path="/account/orders" component={() => <ProtectedRoute component={OrdersPage} />} />
      <Route path="/account/purchases" component={() => <ProtectedRoute component={PurchasesPage} />} />
      <Route path="/account/licenses" component={() => <ProtectedRoute component={LicensesPage} />} />
      <Route path="/account/settings" component={() => <ProtectedRoute component={AccountSettingsPage} />} />
      <Route path="/account/saved" component={() => <ProtectedRoute component={SavedPage} />} />

      {/* Protected: studio (artist | admin) */}
      <Route path="/studio" component={() => <ProtectedRoute component={StudioDashboard} roles={["artist", "admin"]} />} />
      <Route path="/studio/beats" component={() => <ProtectedRoute component={MyBeatsPage} roles={["artist", "admin"]} />} />
      <Route path="/studio/beats/upload" component={() => <ProtectedRoute component={UploadBeatPage} roles={["artist", "admin"]} />} />
      <Route path="/studio/beats/:id/edit" component={() => <ProtectedRoute component={EditBeatPage} roles={["artist", "admin"]} />} />
      <Route path="/studio/earnings" component={() => <ProtectedRoute component={EarningsPage} roles={["artist", "admin"]} />} />
      <Route path="/studio/orders" component={() => <ProtectedRoute component={StudioOrdersPage} roles={["artist", "admin"]} />} />
      <Route path="/studio/store" component={() => <ProtectedRoute component={StudioPageBuilder} roles={["artist", "admin"]} />} />
      <Route path="/studio/leads" component={() => <ProtectedRoute component={StudioLeadsPage} roles={["artist", "admin"]} />} />
      <Route path="/studio/profile" component={() => <ProtectedRoute component={StudioProfilePage} roles={["artist", "admin"]} />} />
      <Route path="/studio/settings" component={() => <ProtectedRoute component={StudioSettingsPage} roles={["artist", "admin"]} />} />

      {/* Protected: admin */}
      <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} roles={["admin"]} />} />
      <Route path="/admin/users" component={() => <ProtectedRoute component={AdminUsersPage} roles={["admin"]} />} />
      <Route path="/admin/beats" component={() => <ProtectedRoute component={AdminBeatsPage} roles={["admin"]} />} />
      <Route path="/admin/payouts" component={() => <ProtectedRoute component={AdminPayoutsPage} roles={["admin"]} />} />
      <Route path="/admin/storefronts" component={() => <ProtectedRoute component={AdminStorefrontsPage} roles={["admin"]} />} />
      <Route path="/admin/emails" component={() => <ProtectedRoute component={AdminEmailsPage} roles={["admin"]} />} />

      <Route path="/become-a-seller" component={BecomeSellerPage} />

      {/* OAuth callbacks — no chrome */}
      <Route path="/auth/google/callback" component={GoogleCallbackPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

const HIDE_CHROME_PATHS = ["/admin", "/login", "/register", "/onboarding", "/forgot-password", "/reset-password", "/auth/"];
const ARTIST_STORE_RE = /^\/artists\/[^/]+$/;

function Layout() {
  const [location] = useLocation();
  const hideChrome = HIDE_CHROME_PATHS.some((p) => location === p || location.startsWith(p + "/") || location.startsWith(p)) || location.startsWith("/profile-setup") || ARTIST_STORE_RE.test(location);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!hideChrome && <Header />}
      <main style={{ flex: 1 }}>
        <AppRouter />
      </main>
      {!hideChrome && <Footer />}
      <BottomPlayer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
