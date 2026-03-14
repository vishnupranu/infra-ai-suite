import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveMetrics } from "@/components/LiveMetrics";
import { ThreatScanner } from "@/components/ThreatScanner";
import { useAppStore } from "@/stores/appStore";
import { useSystemLogsStore } from "@/stores/systemLogsStore";
import { Users, DollarSign, Package, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { language } = useAppStore();
  const { threatsBlocked, authAttempts } = useSystemLogsStore();

  const stats = [
    { label: "Total Users", value: "1,247", icon: Users, change: "+12%" },
    { label: "Revenue (MTD)", value: "$8,439", icon: DollarSign, change: "+23%" },
    { label: "Active Tools", value: "142", icon: Package, change: "+5" },
    { label: "Growth Rate", value: "18.4%", icon: TrendingUp, change: "+2.1%" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <SEO title="Admin Dashboard" />
      <Navbar language={language} setLanguage={(l) => useAppStore.getState().setLanguage(l)} />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Admin Dashboard</span>
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="p-4 bg-gradient-card border-border animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-400">{stat.change}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Live Metrics */}
          <LiveMetrics />

          {/* Threat Scanner */}
          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            <ThreatScanner />
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between p-3 bg-background rounded-lg">
                  <span className="text-muted-foreground">Threats Blocked</span>
                  <span className="font-bold text-primary">{threatsBlocked}</span>
                </div>
                <div className="flex justify-between p-3 bg-background rounded-lg">
                  <span className="text-muted-foreground">Auth Attempts</span>
                  <span className="font-bold">{authAttempts}</span>
                </div>
                <div className="flex justify-between p-3 bg-background rounded-lg">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-bold text-green-400">99.97%</span>
                </div>
                <div className="flex justify-between p-3 bg-background rounded-lg">
                  <span className="text-muted-foreground">Avg Response</span>
                  <span className="font-bold">142ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
