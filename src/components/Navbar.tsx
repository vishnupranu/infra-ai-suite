import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";
import logo from "@/assets/logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut, LayoutDashboard, User as UserIcon, ShieldCheck, Settings,
  Brain, MessageSquare, Wrench, Menu, Building, CreditCard, Gift,
  BarChart3,
} from "lucide-react";

interface NavbarProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export const Navbar = ({ language, setLanguage }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    useAuthStore.getState().reset();
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/tools", label: "AI Tools" },
    { to: "/industries", label: "Industries" },
  ];

  const authLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/ai-chat", label: "AI Chat" },
    { to: "/ai-lab", label: "AI Lab" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="APPAIETECH" className="h-9 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm text-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
            {user && authLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm text-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Admin
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                    <BarChart3 className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                    <UserIcon className="mr-2 h-4 w-4" /> Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/tools")}>
                    <Wrench className="mr-2 h-4 w-4" /> Tools
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/audit")}>
                    <ShieldCheck className="mr-2 h-4 w-4" /> Audit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/analytics")}>
                    <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="hidden sm:block bg-secondary text-foreground rounded-lg px-2 py-1.5 text-xs border-none outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="english">EN</option>
              <option value="telugu">తెలుగు</option>
              <option value="hindi">हिन्दी</option>
            </select>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                    <UserIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/payment/history")}>
                    <CreditCard className="mr-2 h-4 w-4" /> Payments
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/referrals")}>
                    <Gift className="mr-2 h-4 w-4" /> Referrals
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-primary hover:shadow-glow transition-all text-sm"
                size="sm"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.to} to={link.to} className="text-foreground hover:text-primary py-2 border-b border-border">
                      {link.label}
                    </Link>
                  ))}
                  {user && authLinks.map((link) => (
                    <Link key={link.to} to={link.to} className="text-foreground hover:text-primary py-2 border-b border-border">
                      {link.label}
                    </Link>
                  ))}
                  {isAdmin && (
                    <>
                      <p className="text-xs text-muted-foreground font-semibold uppercase mt-4">Admin</p>
                      <Link to="/admin/dashboard" className="text-foreground hover:text-primary py-2">Admin Dashboard</Link>
                      <Link to="/admin/users" className="text-foreground hover:text-primary py-2">Users</Link>
                      <Link to="/admin/tools" className="text-foreground hover:text-primary py-2">Tools</Link>
                      <Link to="/admin/audit" className="text-foreground hover:text-primary py-2">Audit</Link>
                    </>
                  )}
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-4 bg-secondary text-foreground rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="english">English</option>
                    <option value="telugu">తెలుగు</option>
                    <option value="hindi">हिन्दी</option>
                  </select>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
