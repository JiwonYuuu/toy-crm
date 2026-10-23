// lib/ai/agent.ts
import { generateText, stepCountIs, type ToolSet } from "ai"
import { openai } from "@ai-sdk/openai"
import { createReservation, deleteReservation, findCustomer, findResource } from "./tools"
import { getMe } from "@/lib/me"

export async function runAgent(prompt: string) {
  const me = await getMe()
  const tools: ToolSet = me.role === "viewer"
    ? { findCustomer, findResource }
    : { findCustomer, findResource, createReservation, deleteReservation }

  const { text, steps } = await generateText({
    model: openai(process.env.AI_MODEL!),
    system: `너는 예약 담당 직원을 돕는다. 지금 시각은 ${new Date().toISOString()}이고 시간대는 Asia/Seoul이다.`,
    tools,
    stopWhen: stepCountIs(5),
    prompt,
  })
  return { text, steps }
}
