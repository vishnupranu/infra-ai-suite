import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "moderator" | "user" | "developer" | "editor" | "viewer" | null;

interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole;
  loading: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setRole: (role: AppRole) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      role: null,
      loading: true,
      isAdmin: false,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setRole: (role) => set({ role, isAdmin: role === "admin" }),
      setLoading: (loading) => set({ loading }),
      reset: () => set({ user: null, session: null, role: null, loading: false, isAdmin: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ role: state.role, isAdmin: state.isAdmin }),
    }
  )
);
