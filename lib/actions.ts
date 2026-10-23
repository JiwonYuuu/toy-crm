// lib/actions.ts
import { z } from "zod"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import type { AppPermission, AppRole } from "@/lib/types"
import { hasPermission } from "@/lib/permissions"

// 액션을 실행할 때 필요한 정보: 사용자 권한으로 만든 클라이언트, 회사, 역할
export type ActionContext = { supabase: SupabaseClient<Database>; orgId: string; role: AppRole }

export type Action<I extends z.ZodType, O> = {
  name: string
  input: I
  permission: AppPermission
  handler(input: z.infer<I>, ctx: ActionContext): Promise<O>
}

export function defineAction<I extends z.ZodType, O>(action: Action<I, O>) {
  return action
}

// 모든 액션은 이 함수로 실행한다: 권한 확인, 입력 검증, 실행 순서
export async function runAction<I extends z.ZodType, O>(action: Action<I, O>, args: unknown, ctx: ActionContext) {
  if (!(await hasPermission(ctx.role, action.permission))) throw new Error("권한이 없어요")
  return action.handler(action.input.parse(args), ctx)
}

export const createReservationAction = defineAction({
  name: "createReservation",
  input: z.object({
    customer_id: z.string(),
    resource_id: z.string(),
    starts_at: z.string().describe("예약 시작 시각. ISO 8601 형식"),
  }),
  permission: "reservation.create",
  async handler(input, ctx) {
    const startsAt = new Date(input.starts_at)
    const { data, error } = await ctx.supabase
      .from("reservation")
      .insert({
        ...input,
        org_id: ctx.orgId,
        starts_at: startsAt.toISOString(),
        ends_at: new Date(startsAt.getTime() + 60 * 60 * 1000).toISOString(),
      })
      .select("id")
      .single()
    if (error) throw error
    return data
  },
})

// 입력 타입은 스키마에서 만든다. 손으로 다시 적지 않는다.
export type CreateReservationInput = z.infer<typeof createReservationAction.input>

export const deleteReservationAction = defineAction({
  name: "deleteReservation",
  input: z.object({ id: z.string().describe("지울 예약의 id") }),
  permission: "reservation.delete",
  async handler(input, ctx) {
    const { data, error } = await ctx.supabase
      .from("reservation")
      .delete()
      .eq("id", input.id)
      .eq("org_id", ctx.orgId)
      .select("id")
    if (error) throw error
    return { deleted: data.length }
  },
})

export type DeleteReservationInput = z.infer<typeof deleteReservationAction.input>
