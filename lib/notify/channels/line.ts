// lib/notify/channels/line.ts
import type { Notifier } from "../ports"

export const lineNotifier: Notifier = {
  async send(to, message) {
    if (!to.line_id) return { ok: false }   // 연락처가 없으면 실패
    console.log(`[line] ${to.line_id}: ${message}`)
    return { ok: true }
  },
}
