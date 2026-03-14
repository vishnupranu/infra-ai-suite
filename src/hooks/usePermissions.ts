import { useAuthStore, AppRole } from "@/stores/authStore";

const ROLE_HIERARCHY: Record<string, number> = {
  admin: 100,
  moderator: 80,
  developer: 60,
  editor: 40,
  user: 20,
  viewer: 10,
};

export const usePermissions = () => {
  const { role, isAdmin, user } = useAuthStore();

  const hasRole = (requiredRole: AppRole): boolean => {
    if (!role || !requiredRole) return false;
    return (ROLE_HIERARCHY[role] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
  };

  const hasAnyRole = (roles: AppRole[]): boolean => {
    return roles.some((r) => r === role);
  };

  const canAccess = (feature: string): boolean => {
    const featurePermissions: Record<string, number> = {
      dashboard: 10,
      tools: 10,
      "ai-chat": 20,
      "ai-lab": 20,
      profile: 10,
      settings: 20,
      referrals: 20,
      payment: 10,
      "admin-tools": 100,
      "admin-users": 100,
      "admin-audit": 80,
      "admin-analytics": 80,
      "admin-dashboard": 100,
    };
    const requiredLevel = featurePermissions[feature] || 0;
    return (ROLE_HIERARCHY[role || ""] || 0) >= requiredLevel;
  };

  return {
    role,
    isAdmin,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
    canAccess,
  };
};
