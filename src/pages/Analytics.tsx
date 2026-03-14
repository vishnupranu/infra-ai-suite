import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/stores/appStore";
import { useSystemLogsStore } from "@/stores/systemLogsStore";
import { LiveMetrics } from "@/components/LiveMetrics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Eye, Clock } from "lucide-react";

const pageViews = [
  { page: "Home", views: 4520 },
  { page: "Tools", views: 3210 },
  { page: "Dashboard", views: 2890 },
  { page: "AI Chat", views: 1560 },
  { page: "AI Lab", views: 980 },
  { page: "Payment", views: 640 },
];

const userSegments = [
  { name: "Free", value: 65, color: "hsl(0, 0%, 65%)" },
  { name: "Monthly", value: 25, color: "hsl(14, 100%, 60%)" },
  { name: "Yearly", value: 10, color: "hsl(14, 90%, 45%)" },
];

export default function Analytics() {
  const { language } = useAppStore();

  const stats = [
    { label: "Page Views (24h)", value: "12,847", icon: Eye, change: "+18%" },
    { label: "Active Users", value: "892", icon: Users, change: "+7%" },
    { label: "Avg Session", value: "4m 32s", icon: Clock, change: "+12%" },
    { label: "Conversion", value: "3.2%", icon: TrendingUp, change: "+0.4%" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <SEO title="Analytics" />
      <Navbar language={language} setLanguage={(l) => useAppStore.getState().setLanguage(l)} />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Analytics</span>
          </h1>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="p-4 bg-gradient-card border-border">
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

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-gradient-card border-border">
              <CardHeader><CardTitle>Page Views</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={pageViews}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                    <XAxis dataKey="page" stroke="hsl(0, 0%, 65%)" fontSize={12} />
                    <YAxis stroke="hsl(0, 0%, 65%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 10%)",
                        border: "1px solid hsl(0, 0%, 20%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="views" fill="hsl(14, 100%, 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardHeader><CardTitle>User Segments</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={userSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {userSegments.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 10%)",
                        border: "1px solid hsl(0, 0%, 20%)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {userSegments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                      <span className="text-sm text-muted-foreground">{seg.name} ({seg.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <LiveMetrics />
        </div>
      </div>

      <Footer />
    </div>
  );
}
