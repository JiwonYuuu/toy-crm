// components/status-badge.tsx
import { cva } from "class-variance-authority"
import type { ReservationStatus } from "@/lib/types"

const statusBadge = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",   // 모든 상태에 공통인 클래스
  {
    variants: {
      status: {
        booked: "bg-primary/10 text-primary",
        cancelled: "bg-muted text-muted-foreground line-through",
        completed: "bg-emerald-500/10 text-emerald-700",
      } satisfies Record<ReservationStatus, string>,
    },
  },
)

const LABEL = { booked: "예약됨", cancelled: "취소", completed: "완료" } satisfies Record<ReservationStatus, string>

export function StatusBadge({ status }: { status: ReservationStatus }) {
  return <span className={statusBadge({ status })}>{LABEL[status]}</span>
}
