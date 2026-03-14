import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSystemLogsStore } from "@/stores/systemLogsStore";
import { Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";

const severityConfig = {
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/20" },
  warning: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/20" },
  critical: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/20" },
};

const categoryConfig = {
  threat: { label: "Security", color: "destructive" as const },
  auth: { label: "Auth", color: "default" as const },
  infra: { label: "Infra", color: "secondary" as const },
  payment: { label: "Payment", color: "outline" as const },
};

export const ThreatScanner = () => {
  const { logs, threatsBlocked, startScanning, stopScanning, isScanning } =
    useSystemLogsStore();

  useEffect(() => {
    startScanning();
    return () => stopScanning();
  }, [startScanning, stopScanning]);

  return (
    <Card className="bg-gradient-card border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">Threat Scanner</h3>
            <p className="text-xs text-muted-foreground">{threatsBlocked} threats blocked today</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isScanning ? "bg-green-500 animate-pulse" : "bg-muted"}`} />
          <span className="text-xs text-muted-foreground">{isScanning ? "Scanning" : "Idle"}</span>
        </div>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="p-2 space-y-1">
          {logs.slice(0, 20).map((log) => {
            const sev = severityConfig[log.severity];
            const cat = categoryConfig[log.category];
            const Icon = sev.icon;

            return (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
              >
                <div className={`p-1 rounded ${sev.bg} shrink-0 mt-0.5`}>
                  <Icon className={`h-3 w-3 ${sev.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{log.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={cat.color} className="text-[10px] px-1.5 py-0">
                      {cat.label}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {logs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">No threats detected</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
