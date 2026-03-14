import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useSystemLogsStore } from "@/stores/systemLogsStore";
import { Activity, Cpu, HardDrive, AlertTriangle, Wifi } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export const LiveMetrics = () => {
  const { metrics, threatsBlocked, authAttempts, startScanning, stopScanning, isScanning } =
    useSystemLogsStore();

  useEffect(() => {
    startScanning();
    return () => stopScanning();
  }, [startScanning, stopScanning]);

  const trafficData = metrics.traffic.map((value, index) => ({
    hour: `${index}:00`,
    requests: value,
  }));

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CPU Usage</p>
              <p className="text-xl font-bold">{metrics.cpu.toFixed(1)}%</p>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <HardDrive className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Memory</p>
              <p className="text-xl font-bold">{metrics.memory.toFixed(1)}%</p>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-1000"
              style={{ width: `${metrics.memory}%` }}
            />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Wifi className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Requests/min</p>
              <p className="text-xl font-bold">{metrics.requests}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Error Rate</p>
              <p className="text-xl font-bold">{metrics.errorRate.toFixed(2)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Traffic Chart */}
      <Card className="p-6 bg-gradient-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live Traffic
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isScanning ? "bg-green-500 animate-pulse" : "bg-muted"}`} />
            <span className="text-xs text-muted-foreground">{isScanning ? "Live" : "Paused"}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(14, 100%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(14, 100%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
            <XAxis dataKey="hour" stroke="hsl(0, 0%, 65%)" fontSize={10} />
            <YAxis stroke="hsl(0, 0%, 65%)" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 10%)",
                border: "1px solid hsl(0, 0%, 20%)",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="requests"
              stroke="hsl(14, 100%, 60%)"
              fill="url(#trafficGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
