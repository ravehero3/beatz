import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/layout/Header";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import BrowseBeatsPage from "@/pages/BrowseBeatsPage";
import BeatDetailPage from "@/pages/BeatDetailPage";
import ArtistsPage from "@/pages/ArtistsPage";
import ArtistStorePage from "@/pages/ArtistStorePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import PricingPage from "@/pages/PricingPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AccountPage from "@/pages/account/AccountPage";
import PurchasesPage from "@/pages/account/PurchasesPage";
import SavedPage from "@/pages/account/SavedPage";
import StudioDashboard from "@/pages/studio/StudioDashboard";
import MyBeatsPage from "@/pages/studio/MyBeatsPage";
import UploadBeatPage from "@/pages/studio/UploadBeatPage";
import EarningsPage from "@/pages/studio/EarningsPage";
import StudioOrdersPage from "@/pages/studio/StudioOrdersPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminBeatsPage from "@/pages/admin/AdminBeatsPage";
import AdminPayoutsPage from "@/pages/admin/AdminPayoutsPage";
import GoogleCallbackPage from "@/pages/GoogleCallbackPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function ProtectedRoute({ component: Component, roles }: { component: React.ComponentType; roles?: string[] }) {
  const { user } = useAuthStore();
  if (!user) return <Redirect to="/login" />;
  if (roles && !roles.includes(user.role)) return <Redirect to="/" />;
  return <Component />;
}

function PublicOnlyRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useAuthStore();
  if (user) return <Redirect to="/" />;
  return <Component />;
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

      {/* Protected: buyers */}
      <Route path="/checkout" component={() => <ProtectedRoute component={CheckoutPage} />} />
      <Route path="/account" component={() => <ProtectedRoute component={AccountPage} />} />
      <Route path="/account/purchases" component={() => <ProtectedRoute component={PurchasesPage} />} />
      <Route path="/account/saved" component={() => <ProtectedRoute component={SavedPage} />} />

      {/* Protected: studio (artist | admin) */}
      <Route path="/studio" component={() => <ProtectedRoute component={StudioDashboard} roles={["artist", "admin"]} />} />
      <Route path="/studio/beats" component={() => <ProtectedRoute component={MyBeatsPage} roles={["artist", "admin"]} />} />
      <Route path="/studio/beats/upload" component={() => <ProtectedRoute component={UploadBeatPage} roles={["artist", "admin"]} />} />
      <Route path="/studio/earnings" component={() => <ProtectedRoute component={EarningsPage} roles={["artist", "admin"]} />} />
      <Route path="/studio/orders" component={() => <ProtectedRoute component={StudioOrdersPage} roles={["artist", "admin"]} />} />

      {/* Protected: admin */}
      <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} roles={["admin"]} />} />
      <Route path="/admin/users" component={() => <ProtectedRoute component={AdminUsersPage} roles={["admin"]} />} />
      <Route path="/admin/beats" component={() => <ProtectedRoute component={AdminBeatsPage} roles={["admin"]} />} />
      <Route path="/admin/payouts" component={() => <ProtectedRoute component={AdminPayoutsPage} roles={["admin"]} />} />

      {/* OAuth callbacks */}
      <Route path="/auth/google/callback" component={GoogleCallbackPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function Layout() {
  const { pathname } = { pathname: typeof window !== "undefined" ? window.location.pathname : "/" };
  const hideHeader = pathname.startsWith("/studio") || pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register";

  return (
    <>
      <Header />
      <AppRouter />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
