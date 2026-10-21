// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// RLS를 적용받지 않는 클라이언트. 로그인한 사용자 없이 실행되는 서버 작업에서만 쓴다.
export function createAdminClient() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false },
  })
}
