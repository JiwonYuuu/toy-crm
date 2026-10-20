// lib/notify/send-reminder.ts
import type { ChannelKey, Notifier, ReservationWithCustomer } from "./ports"

const text = (r: ReservationWithCustomer) => `${r.customer.name}님, 예약 1시간 전이에요.`

export function makeSendReminder(notifiers: Record<ChannelKey, Notifier>) {
  return async function sendReminder(r: ReservationWithCustomer) {
    const first = await notifiers[r.customer.preferred_channel].send(r.customer, text(r))   // 다형성
    if (first.ok) return "sent"
    const retry = await notifiers.sms.send(r.customer, text(r))
    return retry.ok ? "sent_fallback" : "failed"
  }
}
