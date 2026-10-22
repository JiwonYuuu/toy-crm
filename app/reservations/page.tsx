// app/reservations/page.tsx
import { DataTable } from "@/components/data-table"
import { reservationColumns, type ReservationTableRow } from "./columns"
import { orgRepo, reservationRepo } from "@/lib/repo"
import { getMe } from "@/lib/me"

// 5번 시드 데이터의 "강남 클리닉" id. 12번에서 로그인한 사용자의 회사로 바꾼다.
const ORG_ID = "11111111-1111-1111-1111-111111111111"

export default async function ReservationsPage() {
  const { orgId } = await getMe()
  const org = await orgRepo.get(orgId)
  const format = new Intl.DateTimeFormat("ko-KR", { dateStyle: "short", timeStyle: "short", timeZone: org.timezone })
  const rows: ReservationTableRow[] = (await reservationRepo.list(orgId)).map((r) => ({
    ...r,
    starts_at_label: format.format(new Date(r.starts_at)),
  }))
  return (
    <main className="p-6">
      <DataTable columns={reservationColumns} data={rows} />
    </main>
  )
}
