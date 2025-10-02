import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import logo from "@/assets/logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";

interface NavbarProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export const Navbar = ({ language, setLanguage }: NavbarProps) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const translations = {
    english: {
      home: "Home",
      tools: "AI Tools",
      dashboard: "Dashboard",
      signIn: "Sign In",
      signOut: "Sign Out",
      profile: "Profile",
    },
    telugu: {
      home: "హోమ్",
      tools: "AI టూల్స్",
      dashboard: "డాష్‌బోర్డ్",
      signIn: "సైన్ ఇన్",
      signOut: "సైన్ అవుట్",
      profile: "ప్రొఫైల్",
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="APPAIETECH" className="h-10 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              {t.home}
            </Link>
            <Link to="/tools" className="text-foreground hover:text-primary transition-colors">
              {t.tools}
            </Link>
            {user && (
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                {t.dashboard}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-secondary text-foreground rounded-lg px-3 py-2 text-sm border-none outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="english">English</option>
              <option value="telugu">తెలుగు</option>
            </select>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t.dashboard}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-primary hover:shadow-glow transition-all"
              >
                {t.signIn}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};