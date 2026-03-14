import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/providers/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MobileNav } from "@/components/MobileNav";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Eager load critical pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy load other pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tools = lazy(() => import("./pages/Tools"));
const AdminTools = lazy(() => import("./pages/AdminTools"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminAudit = lazy(() => import("./pages/AdminAudit"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Referrals = lazy(() => import("./pages/Referrals"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const AIChat = lazy(() => import("./pages/AIChat"));
const AILab = lazy(() => import("./pages/AILab"));
const Industries = lazy(() => import("./pages/Industries"));
const IndustryDetail = lazy(() => import("./pages/IndustryDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/tools" element={<Tools />} />
                  <Route path="/industries" element={<Industries />} />
                  <Route path="/industries/:id" element={<IndustryDetail />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/ai-chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
                  <Route path="/ai-lab" element={<ProtectedRoute><AILab /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                  <Route path="/payment/history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
                  <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                  <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
                  <Route path="/admin/tools" element={<ProtectedRoute requireAdmin><AdminTools /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
                  <Route path="/admin/audit" element={<ProtectedRoute requireAdmin><AdminAudit /></ProtectedRoute>} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><Analytics /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <MobileNav />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
