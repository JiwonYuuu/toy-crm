// lib/ai/parse-reservation.ts
import { generateText, Output } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// 모델이 돌려줄 데이터의 모양
const ReservationRequest = z.object({
  customer_name: z.string().describe("손님 이름"),
  starts_at: z.string().describe("예약 시작 시각. ISO 8601 형식"),
  resource_name: z.string().describe("예약 대상 이름. 예: 1번룸"),
})

export async function parseReservation(sentence: string) {
  const { output } = await generateText({
    model: openai(process.env.AI_MODEL!),
    output: Output.object({ schema: ReservationRequest }),
    prompt: `지금 시각은 ${new Date().toISOString()}이고 시간대는 Asia/Seoul이다. 다음 문장을 예약 정보로 바꿔라.\n\n${sentence}`,
  })
  return output   // 스키마 형식을 통과한 객체
}
