// lib/notify/send-reminder.test.ts
import { expect, it } from "vitest"
import { makeSendReminder } from "./send-reminder"
import type { ChannelKey, Notifier, ReservationWithCustomer } from "./ports"

// 가짜 구현: 항상 성공하거나 항상 실패한다
const ok: Notifier = { send: async () => ({ ok: true }) }
const fail: Notifier = { send: async () => ({ ok: false }) }

const reservation = (preferred_channel: ChannelKey): ReservationWithCustomer => ({
  id: "r1",
  customer: { id: "c1", name: "김민수", phone: "+821011112222", email: null, kakao_id: "k1", line_id: null, preferred_channel },
})

it("카카오 발송이 실패하면 문자로 다시 보낸다", async () => {
  const sendReminder = makeSendReminder({ kakao: fail, sms: ok, email: ok, line: ok })
  expect(await sendReminder(reservation("kakao"))).toBe("sent_fallback")
})
