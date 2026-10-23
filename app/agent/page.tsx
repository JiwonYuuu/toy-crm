// app/agent/page.tsx
import { runAgent } from "@/lib/ai/agent"

export default function AgentPage() {
  async function submit(formData: FormData) {
    "use server"
    const { text, steps } = await runAgent(String(formData.get("prompt")))
    for (const step of steps) {
      console.log("도구 호출:", JSON.stringify(step.toolCalls.map((c) => ({ tool: c.toolName, input: c.input }))))
      console.log("도구 결과:", JSON.stringify(step.toolResults.map((r) => r.output)))
    }
    console.log("최종 답:", text)
  }

  return (
    <main className="p-6">
      <form action={submit} className="flex gap-2">
        <input name="prompt" className="w-96 rounded border p-2" placeholder="예: 내일 오후 3시에 김민수 손님 1번룸 예약 잡아줘" />
        <button className="rounded border px-3">보내기</button>
      </form>
    </main>
  )
}
