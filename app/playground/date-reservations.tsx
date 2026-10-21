// app/playground/date-reservations.tsx
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ko } from "react-day-picker/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { StatusBadge } from "@/components/status-badge"
import type { ReservationRow } from "@/lib/types"

// date_key: 회사 시간대 기준 "yyyy-MM-dd". 서버에서 계산해서 넘긴다
export type DatedReservation = ReservationRow & { date_key: string; time_label: string }

export function DateReservations({ reservations }: { reservations: DatedReservation[] }) {
  const [date, setDate] = useState<Date>()
  const [open, setOpen] = useState(false)

  const picked = date ? reservations.filter((r) => r.date_key === format(date, "yyyy-MM-dd")) : []
  // 예약이 있는 날은 달력에 표시
  const reservedDays = [...new Set(reservations.map((r) => r.date_key))].map((key) => new Date(`${key}T00:00`))

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-56 justify-start font-normal">
            <CalendarIcon />
            {date ? format(date, "yyyy년 M월 d일") : "날짜 선택"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={ko}
            selected={date}
            onSelect={(d) => {
              setDate(d)
              setOpen(false)
            }}
            modifiers={{ reserved: reservedDays }}
            modifiersClassNames={{ reserved: "font-bold underline underline-offset-4" }}
          />
        </PopoverContent>
      </Popover>

      {date && picked.length === 0 && (
        <p className="text-muted-foreground text-sm">이 날은 예약이 없습니다.</p>
      )}
      <ul className="space-y-2">
        {picked.map((r) => (
          <li key={r.id} className="flex items-center gap-3 rounded-md border p-3 text-sm">
            <span className="w-12 font-mono">{r.time_label}</span>
            <span className="font-medium">{r.customer_name}</span>
            <span className="text-muted-foreground">{r.resource_name}</span>
            <span className="ml-auto">
              <StatusBadge status={r.status} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
