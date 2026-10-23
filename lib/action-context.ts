// lib/action-context.ts
import { createClient } from "@/lib/supabase/server"
import { getMe } from "@/lib/me"
import type { ActionContext } from "@/lib/actions"

export async function getActionContext(): Promise<ActionContext> {
  const me = await getMe()
  return { supabase: await createClient(), orgId: me.orgId, role: me.role }
}
