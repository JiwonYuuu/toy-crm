// lib/notify/channels/sms.ts
import type { Notifier } from "../ports"

export const smsNotifier: Notifier = {
  async send(to, message) {
    if (!to.phone) return { ok: false }   // 연락처가 없으면 실패
    console.log(`[sms] ${to.phone}: ${message}`)
    return { ok: true }
  },
}
