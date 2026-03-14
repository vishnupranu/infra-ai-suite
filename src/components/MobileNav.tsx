import { useNavigate, useLocation } from "react-router-dom";
import { Home, Wrench, MessageSquare, LayoutDashboard, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/tools", icon: Wrench, label: "Tools" },
  { path: "/ai-chat", icon: MessageSquare, label: "AI Chat", auth: true },
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard", auth: true },
  { path: "/profile", icon: User, label: "Profile", auth: true },
];

export const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredItems = navItems.filter((item) => !item.auth || user);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
