// lib/me.ts
import { createClient } from "@/lib/supabase/server"

export async function getMe() {
  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims.sub
  if (!userId) throw new Error("로그인이 필요해요")

  const { data: member, error } = await supabase
    .from("member")
    .select("org_id, role")
    .eq("user_id", userId)
    .single()
  if (error) throw error
  return { userId, orgId: member.org_id, role: member.role }
}
