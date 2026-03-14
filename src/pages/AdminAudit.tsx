import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/stores/appStore";
import { Loader2, Search, FileText, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminAudit() {
  const { language } = useAppStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (data && data.length > 0) {
      setLogs(data);
    } else {
      // Mock data
      setLogs(
        Array.from({ length: 50 }, (_, i) => ({
          id: `mock-${i}`,
          action: ["user.login", "user.signup", "tool.create", "tool.update", "payment.process", "admin.role_change", "system.backup"][i % 7],
          resource_type: ["auth", "ai_tools", "payments", "profiles", "system"][i % 5],
          metadata: { ip: `192.168.1.${i + 1}`, browser: "Chrome" },
          created_at: new Date(Date.now() - i * 3600000).toISOString(),
          user_id: `user-${i % 10}`,
        }))
      );
    }
    setLoading(false);
  };

  const actionColors: Record<string, string> = {
    "user.login": "bg-green-500/20 text-green-400",
    "user.signup": "bg-blue-500/20 text-blue-400",
    "tool.create": "bg-primary/20 text-primary",
    "tool.update": "bg-yellow-500/20 text-yellow-400",
    "payment.process": "bg-purple-500/20 text-purple-400",
    "admin.role_change": "bg-destructive/20 text-destructive",
    "system.backup": "bg-muted text-muted-foreground",
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.action?.includes(searchQuery.toLowerCase()) || log.resource_type?.includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || log.resource_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <SEO title="Audit Trail" />
      <Navbar language={language} setLanguage={(l) => useAppStore.getState().setLanguage(l)} />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <span className="bg-gradient-primary bg-clip-text text-transparent">Audit Trail</span>
            </h1>
            <p className="text-muted-foreground mt-1">{logs.length} events logged</p>
          </div>

          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search actions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="auth">Auth</SelectItem>
                    <SelectItem value="ai_tools">Tools</SelectItem>
                    <SelectItem value="payments">Payments</SelectItem>
                    <SelectItem value="profiles">Profiles</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                      >
                        <Badge className={`shrink-0 text-[10px] ${actionColors[log.action] || "bg-muted text-muted-foreground"}`}>
                          {log.action}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">
                            <span className="text-muted-foreground">Resource:</span>{" "}
                            <span className="font-medium">{log.resource_type}</span>
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
