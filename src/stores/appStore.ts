import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface AppState {
  language: string;
  sidebarOpen: boolean;
  notifications: Notification[];
  setLanguage: (lang: string) => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: "english",
      sidebarOpen: true,
      notifications: [],
      setLanguage: (language) => set({ language }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: crypto.randomUUID(),
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ].slice(0, 50),
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      clearNotifications: () => set({ notifications: [] }),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: "app-storage",
      partialize: (state) => ({ language: state.language, sidebarOpen: state.sidebarOpen }),
    }
  )
);
