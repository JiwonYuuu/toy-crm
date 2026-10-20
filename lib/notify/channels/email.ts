// lib/notify/channels/email.ts
import type { Notifier } from "../ports"

export const emailNotifier: Notifier = {
  async send(to, message) {
    if (!to.email) return { ok: false }   // 연락처가 없으면 실패
    console.log(`[email] ${to.email}: ${message}`)
    return { ok: true }
  },
}
