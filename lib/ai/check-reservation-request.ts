// lib/ai/check-reservation-request.ts
import { customerRepo } from "@/lib/repo"

export async function checkReservationRequest(orgId: string, request: { customer_name: string; starts_at: string }) {
  const customer = await customerRepo.findByName(orgId, request.customer_name)
  if (!customer) return { ok: false, error: `${request.customer_name} 손님이 없어요` }

  const startsAt = new Date(request.starts_at)
  if (Number.isNaN(startsAt.getTime())) return { ok: false, error: "시각 형식이 올바르지 않아요" }
  if (startsAt.getTime() <= Date.now()) return { ok: false, error: "지난 시각에는 예약할 수 없어요" }

  return { ok: true, customer, startsAt }
}
