export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_tools: {
        Row: {
          affiliate_link: string
          category: string
          created_at: string | null
          description: string
          features: string[] | null
          icon_url: string | null
          id: string
          is_featured: boolean | null
          name: string
          price_annual: number | null
          price_monthly: number | null
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          affiliate_link: string
          category: string
          created_at?: string | null
          description: string
          features?: string[] | null
          icon_url?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          price_annual?: number | null
          price_monthly?: number | null
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          affiliate_link?: string
          category?: string
          created_at?: string | null
          description?: string
          features?: string[] | null
          icon_url?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          price_annual?: number | null
          price_monthly?: number | null
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          referral_id: string | null
          source: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          referral_id?: string | null
          source: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          referral_id?: string | null
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "earnings_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          payment_method: string
          status: string | null
          tool_id: string | null
          transaction_id: string | null
          updated_at: string | null
          upi_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_method: string
          status?: string | null
          tool_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          upi_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_method?: string
          status?: string | null
          tool_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          upi_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "ai_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          preferred_language: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          preferred_language?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          preferred_language?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_user_id: string
          referrer_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_user_id: string
          referrer_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_user_id?: string
          referrer_id?: string
          status?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number | null
          created_at: string | null
          end_date: string | null
          id: string
          payment_id: string | null
          payment_method: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          tool_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          tool_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          tool_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "ai_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      validate_payment_amount: {
        Args: { p_amount: number; p_tool_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin"
      subscription_status: "active" | "inactive" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin"],
      subscription_status: ["active", "inactive", "pending"],
    },
  },
} as const
