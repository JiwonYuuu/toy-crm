// lib/ai/agent.ts
import { generateText, stepCountIs, type ToolSet } from "ai"
import { openai } from "@ai-sdk/openai"
import { findCustomer, findResource } from "./tools"
import { getMe } from "@/lib/me"
import { toolsFor } from "./tools-from-actions"
import { getActionContext } from "@/lib/action-context"



export async function runAgent(prompt: string) {
  const me = await getMe()

  const actionTools = toolsFor(await getActionContext())
  const tools: ToolSet = me.role === "viewer"
    ? { findCustomer, findResource }
    : { findCustomer, findResource, ...actionTools }

  const { text, steps } = await generateText({
    model: openai(process.env.AI_MODEL!),
    system: `너는 예약 담당 직원을 돕는다. 지금 시각은 ${new Date().toISOString()}이고 시간대는 Asia/Seoul이다.`,
    tools,
    stopWhen: stepCountIs(5),
    prompt,
  })
  return { text, steps }
}
