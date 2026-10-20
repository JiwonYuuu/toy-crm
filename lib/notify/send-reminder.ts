// lib/notify/send-reminder.ts (1단계: 비교용)
import { sendKakao } from "@/lib/vendors/kakao"
import { sendSms } from "@/lib/vendors/sms"

type ReservationWithCustomer = {
  id: string
  customer: { name: string; phone: string | null; kakao_id: string | null; preferred_channel: "kakao" | "sms" | "email" }
}

const text = (r: ReservationWithCustomer) => `${r.customer.name}님, 예약 1시간 전이에요.`

export async function sendReminder(r: ReservationWithCustomer) {
  try {
    if (r.customer.preferred_channel === "kakao") await sendKakao(r.customer.kakao_id!, text(r))
    else await sendSms(r.customer.phone!, text(r))
    return "sent"
  } catch {
    await sendSms(r.customer.phone!, text(r))   // 실패하면 문자로 다시 보낸다
    return "sent_fallback"
  }
}
