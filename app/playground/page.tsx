// app/playground/page.tsx
import { ReservationCard } from "@/components/reservation-card"
import { Button } from "@/components/ui/button"
import { DivToggle } from "@/components/div-toggle"
import { Switch } from "@/components/ui/switch"
import { StatusBadge } from "@/components/status-badge"

const sample = {
  id: "1",
  starts_at: "2026-10-20 15:00",
  status: "booked" as const,
  customer_name: "김민수",
  resource_name: "1번룸",
}

export default function PlaygroundPage() {
  return (
    <main className="space-y-4 p-6">
      <ReservationCard reservation={sample} />
      <Button>기본 버튼</Button>
      <DivToggle />
      <Switch />
      <div className="flex gap-2">
        <StatusBadge status="booked" />
        <StatusBadge status="cancelled" />
        <StatusBadge status="completed" />
      </div>
    </main>
  )
}
