// lib/permissions.ts
import { createClient } from "@/lib/supabase/server"
import type { AppPermission, AppRole } from "@/lib/types"

export async function hasPermission(role: AppRole, permission: AppPermission): Promise<boolean> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("role_permissions")
    .select("*", { count: "exact", head: true })
    .eq("role", role)
    .eq("permission", permission)
  if (error) throw error
  return (count ?? 0) > 0
}
