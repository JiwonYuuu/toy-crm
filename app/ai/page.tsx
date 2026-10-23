import { parseReservation } from "@/lib/ai/parse-reservation"
import { getMe } from "@/lib/me"
import { checkReservationRequest } from "@/lib/ai/check-reservation-request"


export default function AiPage() {
  async function submit(formData: FormData) {
    "use server"
    const me = await getMe()
    const result = await parseReservation(String(formData.get("sentence")))
    console.log("구조화된 출력:", result)
    console.log("내용 확인:", await checkReservationRequest(me.orgId, result))
  }

  return (
    <main className="p-6">
      <form action={submit} className="flex gap-2">
        <input name="sentence" className="w-96 rounded border p-2" placeholder="예: 내일 오후 3시에 김민수 손님 1번룸 예약 잡아줘" />
        <button className="rounded border px-3">보내기</button>
      </form>
    </main>
  )
}
