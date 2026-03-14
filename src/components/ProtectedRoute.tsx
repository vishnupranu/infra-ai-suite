import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requireAdmin = false, requiredRoles }: ProtectedRouteProps) => {
  const { user, role, loading, isAdmin } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0 && role && !requiredRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
