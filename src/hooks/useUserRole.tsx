import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "moderator" | "user" | "developer" | "editor" | "viewer" | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error) {
          setRole("user");
        } else {
          setRole((data?.role as UserRole) || "user");
        }
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
        setRole("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return { role, loading, isAdmin: role === "admin" };
};
