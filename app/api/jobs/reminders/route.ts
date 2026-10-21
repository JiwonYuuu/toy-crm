// app/api/jobs/reminders/route.ts
import { createAdminClient } from "@/lib/supabase/admin"
import { sendReminder } from "@/lib/notify"

export async function POST(request: Request) {
  // 1. CRON_SECRET을 아는 요청만 실행한다
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  // 2. 보낼 알림을 예약, 손님 정보와 함께 한 번에 가져온다
  const supabase = createAdminClient()
  const { data: jobs, error } = await supabase
    .from("notification")
    .select("id, reservation:reservation_id(id, customer:customer!reservation_customer_fk(id, name, phone, email, kakao_id, preferred_channel))")
    .eq("status", "pending")
    .limit(50)
  if (error) throw error

  // 3. 알림마다 보내고, 결과를 기록한다
  for (const job of jobs) {
    const result = await sendReminder(job.reservation)
    const { error: updateError } = await supabase
      .from("notification")
      .update({ status: result === "failed" ? "failed" : "sent" })
      .eq("id", job.id)
    if (updateError) throw updateError
  }
  return Response.json({ processed: jobs.length })
}
