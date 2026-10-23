// lib/ai/tools.ts
import { tool } from "ai"
import { z } from "zod"
import { customerRepo, reservationRepo, resourceRepo } from "@/lib/repo"
import { getMe } from "@/lib/me"
import { hasPermission } from "@/lib/permissions"

export const findCustomer = tool({
  description: "이름으로 손님을 찾는다. 손님의 id를 돌려준다.",
  inputSchema: z.object({ name: z.string().describe("손님 이름") }),
  execute: async ({ name }) => {
    const me = await getMe()
    return (await customerRepo.findByName(me.orgId, name)) ?? { error: `${name} 손님이 없어요` }
  },
})

export const findResource = tool({
  description: "이름으로 예약 대상(방, 장비)을 찾는다. 예약 대상의 id를 돌려준다.",
  inputSchema: z.object({ name: z.string().describe("예약 대상 이름. 예: 1번룸") }),
  execute: async ({ name }) => {
    const me = await getMe()
    return (await resourceRepo.findByName(me.orgId, name)) ?? { error: `${name} 예약 대상이 없어요` }
  },
})

export const createReservation = tool({
  description: "예약을 하나 만든다. customer_id와 resource_id는 findCustomer와 findResource로 먼저 찾는다.",
  inputSchema: z.object({
    customer_id: z.string(),
    resource_id: z.string(),
    starts_at: z.string().describe("예약 시작 시각. ISO 8601 형식"),
  }),
  execute: async (input) => {
    const me = await getMe()
    if (new Date(input.starts_at).getTime() <= Date.now()){
      return { error: "지난 시각에는 예약할 수 없어요"}
    }
    return await reservationRepo.create({ ...input, org_id: me.orgId })
  },
})

export const deleteReservation = tool({
  description: "예약을 하나 지운다",
  inputSchema: z.object({ id: z.string().describe("지울 예약의 id") }),
  execute: async ({ id }) => {
    const me = await getMe()
    if (!(await hasPermission(me.role, "reservation.delete"))) {
      return { error: "예약을 지울 권한이 없어요" }
    }
    return await reservationRepo.delete(id)
  },
})
