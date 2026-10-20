// lib/notify/channels/kakao.ts
import type { Notifier } from "../ports"

export const kakaoNotifier: Notifier = {
  async send(to, message) {
    if (!to.kakao_id) return { ok: false }   // 연락처가 없으면 실패
    console.log(`[kakao] ${to.kakao_id}: ${message}`)
    return { ok: true }
  },
}
