// app/playground/patient-directory.tsx
"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CHANNEL_LABEL } from "@/lib/labels"
import type { Channel } from "@/lib/types"

export type PatientRow = {
  id: string
  name: string
  phone: string | null
  channel: Channel
  reservationCount: number
  lastReservation: string | null
}

// "+821011112222" → "010-1111-2222"
function formatPhone(phone: string | null) {
  if (!phone) return "-"
  return phone
    .replace(/^\+82/, "0")
    .replace(/\D/g, "")
    .replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3")
}

export function PatientDirectory({ patients }: { patients: PatientRow[] }) {
  const [query, setQuery] = useState("")
  const q = query.trim()
  const digits = q.replace(/\D/g, "")
  const shown = q
    ? patients.filter(
        (p) => p.name.includes(q) || (digits !== "" && formatPhone(p.phone).replace(/\D/g, "").includes(digits)),
      )
    : patients

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle>환자 목록</CardTitle>
          <CardDescription className="mt-1.5">등록 환자 {patients.length}명</CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름 또는 전화번호 검색"
            aria-label="환자 검색"
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>환자</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>선호 채널</TableHead>
              <TableHead className="text-right">예약</TableHead>
              <TableHead className="text-right">최근 예약</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {p.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{formatPhone(p.phone)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{CHANNEL_LABEL[p.channel]}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{p.reservationCount}건</TableCell>
                <TableCell className="text-muted-foreground text-right">{p.lastReservation ?? "-"}</TableCell>
              </TableRow>
            ))}
            {shown.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                  검색 결과가 없어요
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
