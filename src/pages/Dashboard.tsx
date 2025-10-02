import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@supabase/supabase-js";
import {
  Wallet,
  CreditCard,
  Star,
  TrendingUp,
  Package,
  Bell,
} from "lucide-react";

export default function Dashboard() {
  const [language, setLanguage] = useState("english");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
      fetchSubscriptions(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    setProfile(data);
  };

  const fetchSubscriptions = async (userId: string) => {
    const { data } = await supabase
      .from("subscriptions")
      .select("*, ai_tools(*)")
      .eq("user_id", userId);
    
    setSubscriptions(data || []);
  };

  const translations = {
    english: {
      welcome: "Welcome back",
      overview: "Overview",
      subscriptions: "My Subscriptions",
      payments: "Payment Methods",
      credits: "Credits & Earnings",
      stats: {
        tools: "Active Tools",
        spent: "Total Spent",
        earnings: "Referral Earnings",
        saved: "Money Saved",
      },
    },
    telugu: {
      welcome: "తిరిగి స్వాగతం",
      overview: "అవలోకనం",
      subscriptions: "నా సబ్‌స్క్రిప్షన్‌లు",
      payments: "చెల్లింపు పద్ధతులు",
      credits: "క్రెడిట్లు & ఆదాయాలు",
      stats: {
        tools: "క్రియాశీల టూల్స్",
        spent: "మొత్తం ఖర్చు",
        earnings: "రెఫరల్ ఆదాయాలు",
        saved: "డబ్బు ఆదా",
      },
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} setLanguage={setLanguage} />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {t.welcome}, {profile?.full_name || user?.email}!
            </h1>
            <p className="text-muted-foreground">
              Manage your AI tools and subscriptions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.tools}</p>
                  <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.spent}</p>
                  <p className="text-2xl font-bold">
                    ${subscriptions.reduce((acc, sub) => acc + (Number(sub.amount) || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.earnings}</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.saved}</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-secondary border-border">
              <TabsTrigger value="overview">{t.overview}</TabsTrigger>
              <TabsTrigger value="subscriptions">{t.subscriptions}</TabsTrigger>
              <TabsTrigger value="payments">{t.payments}</TabsTrigger>
              <TabsTrigger value="credits">{t.credits}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6">
                <Card className="p-6 bg-gradient-card border-border">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {subscriptions.length > 0 ? (
                      subscriptions.slice(0, 5).map((sub) => (
                        <div key={sub.id} className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                          <Star className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{sub.ai_tools?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                            {sub.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No subscriptions yet. Explore our AI tools marketplace!
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subscriptions" className="mt-6">
              <Card className="p-6 bg-gradient-card border-border">
                <h2 className="text-xl font-bold mb-4">{t.subscriptions}</h2>
                <div className="space-y-4">
                  {subscriptions.length > 0 ? (
                    subscriptions.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div>
                          <p className="font-medium">{sub.ai_tools?.name}</p>
                          <p className="text-sm text-muted-foreground">${sub.amount}/month</p>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No active subscriptions
                    </p>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <Card className="p-6 bg-gradient-card border-border">
                <h2 className="text-xl font-bold mb-4">{t.payments}</h2>
                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-border rounded-lg text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Add your UPI ID for payments
                    </p>
                    <Button className="bg-gradient-primary">Add Payment Method</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="credits" className="mt-6">
              <Card className="p-6 bg-gradient-card border-border">
                <h2 className="text-xl font-bold mb-4">{t.credits}</h2>
                <div className="p-6 bg-secondary rounded-lg text-center">
                  <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-3xl font-bold mb-2">$0.00</p>
                  <p className="text-muted-foreground mb-4">
                    Referral earnings will appear here
                  </p>
                  <Button className="bg-gradient-primary">Share Referral Link</Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}