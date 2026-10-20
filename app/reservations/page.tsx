// app/reservations/page.tsx
import { reservationRepo } from "@/lib/repo"

// 5번 시드 데이터의 "강남 클리닉" id. 12번에서 로그인한 사용자의 회사로 바꾼다.
const ORG_ID = "11111111-1111-1111-1111-111111111111"

export default async function ReservationsPage() {
  const reservations = await reservationRepo.list(ORG_ID)
  return (
    <ul className="p-6">
      {reservations.map((r) => (
        <li key={r.id}>
          {r.starts_at} {r.customer_name} {r.resource_name}
        </li>
      ))}
    </ul>
  )
}
