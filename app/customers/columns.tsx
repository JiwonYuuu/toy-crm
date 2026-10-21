"use client"
import type { ColumnDef } from "@tanstack/react-table"
import type { Features } from "@/lib/table"
import type { CustomerRow } from "@/lib/types"

export const customerColumns: ColumnDef<Features, CustomerRow>[] = [
  { accessorKey: "name", header: "이름" },
  { accessorKey: "phone", header: "전화번호", cell: ({ row }) => row.original.phone ?? "-" },
]
