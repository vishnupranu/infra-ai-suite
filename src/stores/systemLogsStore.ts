import { create } from "zustand";

interface SystemLog {
  id: string;
  category: "threat" | "auth" | "infra" | "payment";
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface MetricsSnapshot {
  cpu: number;
  memory: number;
  requests: number;
  errorRate: number;
  traffic: number[];
  timestamp: string;
}

interface SystemLogsState {
  logs: SystemLog[];
  metrics: MetricsSnapshot;
  threatsBlocked: number;
  authAttempts: number;
  isScanning: boolean;
  addLog: (log: Omit<SystemLog, "id" | "timestamp">) => void;
  updateMetrics: () => void;
  startScanning: () => void;
  stopScanning: () => void;
  intervalId: number | null;
}

const generateMetrics = (): MetricsSnapshot => ({
  cpu: 15 + Math.random() * 45,
  memory: 30 + Math.random() * 40,
  requests: Math.floor(100 + Math.random() * 900),
  errorRate: Math.random() * 5,
  traffic: Array.from({ length: 24 }, () => Math.floor(50 + Math.random() * 200)),
  timestamp: new Date().toISOString(),
});

const threatMessages = [
  "SQL injection attempt blocked from 192.168.1.x",
  "Brute force login attempt detected",
  "DDoS mitigation active - 1.2K requests filtered",
  "XSS payload detected and sanitized",
  "Suspicious API key usage from unknown IP",
  "Rate limit exceeded for endpoint /api/auth",
  "Unauthorized access attempt to admin panel",
  "Certificate validation failure detected",
];

const authMessages = [
  "User login successful - 2FA verified",
  "Password reset requested",
  "New device login detected",
  "Session expired - token refreshed",
  "OAuth callback processed",
];

const infraMessages = [
  "Database connection pool at 80% capacity",
  "CDN cache hit ratio: 94.2%",
  "Edge function cold start: 120ms",
  "SSL certificate renewal scheduled",
  "Storage bucket approaching quota",
];

const paymentMessages = [
  "Payment processed: $9.99 - Monthly plan",
  "Subscription renewal successful",
  "Refund initiated: $5.99",
  "Payment webhook received",
  "Invoice generated for user",
];

export const useSystemLogsStore = create<SystemLogsState>((set, get) => ({
  logs: [],
  metrics: generateMetrics(),
  threatsBlocked: Math.floor(Math.random() * 50) + 100,
  authAttempts: Math.floor(Math.random() * 30) + 50,
  isScanning: false,
  intervalId: null,

  addLog: (log) =>
    set((state) => ({
      logs: [
        { ...log, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
        ...state.logs,
      ].slice(0, 100),
    })),

  updateMetrics: () => {
    const categories = ["threat", "auth", "infra", "payment"] as const;
    const messageMaps = { threat: threatMessages, auth: authMessages, infra: infraMessages, payment: paymentMessages };
    const severities = ["info", "warning", "critical"] as const;

    const category = categories[Math.floor(Math.random() * categories.length)];
    const msgs = messageMaps[category];
    const message = msgs[Math.floor(Math.random() * msgs.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];

    set((state) => ({
      metrics: generateMetrics(),
      threatsBlocked: category === "threat" ? state.threatsBlocked + 1 : state.threatsBlocked,
      authAttempts: category === "auth" ? state.authAttempts + 1 : state.authAttempts,
      logs: [
        { id: crypto.randomUUID(), category, severity, message, timestamp: new Date().toISOString() },
        ...state.logs,
      ].slice(0, 100),
    }));
  },

  startScanning: () => {
    const state = get();
    if (state.intervalId) return;
    const id = window.setInterval(() => get().updateMetrics(), 5000);
    set({ isScanning: true, intervalId: id });
  },

  stopScanning: () => {
    const state = get();
    if (state.intervalId) {
      clearInterval(state.intervalId);
    }
    set({ isScanning: false, intervalId: null });
  },
}));
