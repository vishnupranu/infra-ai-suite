import { ReactNode } from "react";
import { useAuthStore, AppRole } from "@/stores/authStore";

interface RoleGuardProps {
  children: ReactNode;
  roles?: AppRole[];
  fallback?: ReactNode;
}

export const RoleGuard = ({ children, roles, fallback = null }: RoleGuardProps) => {
  const { role } = useAuthStore();

  if (!roles || roles.length === 0) return <>{children}</>;
  if (!role) return <>{fallback}</>;
  if (roles.includes(role)) return <>{children}</>;

  return <>{fallback}</>;
};
