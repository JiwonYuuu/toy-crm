// lib/ai/tools-from-actions.ts
import { tool } from "ai"
import { createReservationAction, deleteReservationAction, runAction, type ActionContext } from "@/lib/actions"

export function toolsFor(ctx: ActionContext) {
  return {
    createReservation: tool({
      description: "예약을 하나 만든다. customer_id와 resource_id는 findCustomer와 findResource로 먼저 찾는다.",
      inputSchema: createReservationAction.input,   // 액션의 스키마를 그대로 쓴다
      execute: (args) => runAction(createReservationAction, args, ctx),
    }),
    deleteReservation: tool({
          description: "예약을 하나 지운다",
          inputSchema: deleteReservationAction.input,
          execute: (args) => runAction(deleteReservationAction, args, ctx),
    }),
  }
}
