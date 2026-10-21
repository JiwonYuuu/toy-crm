// components/reservation-card.tsx
import type { ReservationRow } from "@/lib/types"

export function ReservationCard({ reservation }: { reservation: ReservationRow }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-muted md:flex-row md:items-center md:gap-4">
      <span className="font-medium">{reservation.customer_name}</span>
      <span className="text-sm text-muted-foreground">{reservation.starts_at}</span>
      <span className="text-sm md:ml-auto">{reservation.status}</span>
    </div>
  )
}
