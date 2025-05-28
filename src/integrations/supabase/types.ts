export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      departments: {
        Row: {
          created_at: string
          employee_count: number | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          employee_count?: number | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          employee_count?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          current_order: string | null
          daily_target: number
          department: string
          id: string
          monthly_production: number
          name: string
          production: number
          status: string | null
        }
        Insert: {
          created_at?: string
          current_order?: string | null
          daily_target?: number
          department: string
          id?: string
          monthly_production?: number
          name: string
          production?: number
          status?: string | null
        }
        Update: {
          created_at?: string
          current_order?: string | null
          daily_target?: number
          department?: string
          id?: string
          monthly_production?: number
          name?: string
          production?: number
          status?: string | null
        }
        Relationships: []
      }
      monthly_stats: {
        Row: {
          created_at: string
          id: string
          month: string
          target_completion_percentage: number | null
          total_production: number | null
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: string
          target_completion_percentage?: number | null
          total_production?: number | null
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: string
          target_completion_percentage?: number | null
          total_production?: number | null
          year?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          assigned_workers: string[] | null
          client: string
          completion_percentage: number | null
          created_at: string
          delivery_date: string
          entry_date: string
          id: string
          product: Json
          receiving_date: string
          status: string
          total_quantity: number
        }
        Insert: {
          assigned_workers?: string[] | null
          client: string
          completion_percentage?: number | null
          created_at?: string
          delivery_date: string
          entry_date: string
          id?: string
          product: Json
          receiving_date: string
          status?: string
          total_quantity: number
        }
        Update: {
          assigned_workers?: string[] | null
          client?: string
          completion_percentage?: number | null
          created_at?: string
          delivery_date?: string
          entry_date?: string
          id?: string
          product?: Json
          receiving_date?: string
          status?: string
          total_quantity?: number
        }
        Relationships: []
      }
      production_records: {
        Row: {
          created_at: string
          date: string
          employee_id: string | null
          id: string
          order_details: string | null
          order_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          date: string
          employee_id?: string | null
          id?: string
          order_details?: string | null
          order_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string
          date?: string
          employee_id?: string | null
          id?: string
          order_details?: string | null
          order_id?: string | null
          quantity?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
