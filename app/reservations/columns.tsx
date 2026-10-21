// app/reservations/columns.tsx
"use client"
import type { ColumnDef } from "@tanstack/react-table"
import type { Features } from "@/lib/table"
import type { ReservationRow } from "@/lib/types"
import { StatusBadge } from "@/components/status-badge"

// 화면에 보여줄 시각 문자열(starts_at_label)을 더한 예약 행
export type ReservationTableRow = ReservationRow & { starts_at_label: string }

export const reservationColumns: ColumnDef<Features, ReservationTableRow>[] = [
  { accessorKey: "customer_name", header: "손님" },
  { accessorKey: "resource_name", header: "예약 대상" },
  { accessorKey: "starts_at_label", header: "시작 시각" },
  { accessorKey: "status", header: "상태", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
]
