// lib/notify/ports.ts
export type ChannelKey = "kakao" | "sms" | "email" | "line"

export type Customer = {
  id: string
  name: string
  phone: string | null
  email: string | null
  kakao_id: string | null
  line_id?: string | null
  preferred_channel: ChannelKey
}

export type ReservationWithCustomer = { id: string; customer: Customer }

// 모든 채널 구현이 지켜야 하는 모양
export interface Notifier {
  send(to: Customer, message: string): Promise<{ ok: boolean }>
}
