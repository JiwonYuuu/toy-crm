
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "audit_log": {
                  Row: {
                    "action": string,"actor_id": string | null,"after": Json | null,"before": Json | null,"created_at": string,"id": string,"org_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"after"?: Json | null,"before"?: Json | null,"created_at"?: string,"id"?: string,"org_id": string
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"after"?: Json | null,"before"?: Json | null,"created_at"?: string,"id"?: string,"org_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_log_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organization"
      referencedColumns: ["id"]
    }
                  ]
                },"customer": {
                  Row: {
                    "email": string | null,"id": string,"kakao_id": string | null,"name": string,"org_id": string,"phone": string | null,"preferred_channel": Database["public"]['Enums']["channel"]
                  }
                  ComputedFields: never
                  Insert: {
                    "email"?: string | null,"id"?: string,"kakao_id"?: string | null,"name": string,"org_id": string,"phone"?: string | null,"preferred_channel"?: Database["public"]['Enums']["channel"]
                  }
                  Update: {
                    "email"?: string | null,"id"?: string,"kakao_id"?: string | null,"name"?: string,"org_id"?: string,"phone"?: string | null,"preferred_channel"?: Database["public"]['Enums']["channel"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "customer_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organization"
      referencedColumns: ["id"]
    }
                  ]
                },"member": {
                  Row: {
                    "org_id": string,"role": Database["public"]['Enums']["app_role"],"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "org_id": string,"role"?: Database["public"]['Enums']["app_role"],"user_id": string
                  }
                  Update: {
                    "org_id"?: string,"role"?: Database["public"]['Enums']["app_role"],"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "member_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organization"
      referencedColumns: ["id"]
    }
                  ]
                },"notification": {
                  Row: {
                    "created_at": string,"id": string,"kind": string,"org_id": string,"reservation_id": string,"status": Database["public"]['Enums']["notification_status"]
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"kind": string,"org_id": string,"reservation_id": string,"status"?: Database["public"]['Enums']["notification_status"]
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"kind"?: string,"org_id"?: string,"reservation_id"?: string,"status"?: Database["public"]['Enums']["notification_status"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "notification_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organization"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notification_reservation_id_fkey"
      columns: ["reservation_id"]
isOneToOne: false
      referencedRelation: "reservation"
      referencedColumns: ["id"]
    }
                  ]
                },"organization": {
                  Row: {
                    "id": string,"name": string,"timezone": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: string,"name": string,"timezone"?: string
                  }
                  Update: {
                    "id"?: string,"name"?: string,"timezone"?: string
                  }
                  Relationships: [
                    
                  ]
                },"reservation": {
                  Row: {
                    "created_at": string,"customer_id": string,"ends_at": string,"id": string,"org_id": string,"resource_id": string,"starts_at": string,"status": Database["public"]['Enums']["reservation_status"],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"customer_id": string,"ends_at": string,"id"?: string,"org_id": string,"resource_id": string,"starts_at": string,"status"?: Database["public"]['Enums']["reservation_status"],"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"customer_id"?: string,"ends_at"?: string,"id"?: string,"org_id"?: string,"resource_id"?: string,"starts_at"?: string,"status"?: Database["public"]['Enums']["reservation_status"],"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "reservation_customer_fk"
      columns: ["org_id","customer_id"]
isOneToOne: false
      referencedRelation: "customer"
      referencedColumns: ["org_id","id"]
    },{
      foreignKeyName: "reservation_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organization"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reservation_resource_id_fkey"
      columns: ["resource_id"]
isOneToOne: false
      referencedRelation: "resource"
      referencedColumns: ["id"]
    }
                  ]
                },"resource": {
                  Row: {
                    "id": string,"name": string,"org_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: string,"name": string,"org_id": string
                  }
                  Update: {
                    "id"?: string,"name"?: string,"org_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "resource_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organization"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            [_ in never]: never
          }
          Enums: {
            "app_role": "owner"|"admin"|"staff"|"viewer","channel": "kakao"|"sms"|"email","notification_status": "pending"|"sent"|"failed","reservation_status": "booked"|"cancelled"|"completed"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "app_role": ["owner", "admin", "staff", "viewer"],"channel": ["kakao", "sms", "email"],"notification_status": ["pending", "sent", "failed"],"reservation_status": ["booked", "cancelled", "completed"]
          }
        }
} as const
