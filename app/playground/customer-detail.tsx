// app/playground/customer-detail.tsx
"use client"

import { useState } from "react"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { CHANNEL_LABEL } from "@/lib/labels"
import type { CustomerDetailRow, NotificationRow, ReservationRow } from "@/lib/types"

export type DetailReservation = ReservationRow & { starts_at_label: string }
export type DetailNotification = NotificationRow & { created_at_label: string; reservation_starts_at_label: string }

export function CustomerDetail({
  customers,
  reservations,
  notifications,
}: {
  customers: CustomerDetailRow[]
  reservations: DetailReservation[]
  notifications: DetailNotification[]
}) {
  const [customerId, setCustomerId] = useState("")
  const customer = customers.find((c) => c.id === customerId)

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <NativeSelect value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
        <NativeSelectOption value="">손님 선택</NativeSelectOption>
        {customers.map((c) => (
          <NativeSelectOption key={c.id} value={c.id}>
            {c.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      {customer && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback>{customer.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{customer.name}</CardTitle>
              <CardDescription>{customer.phone ?? "전화번호 없음"}</CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">기본 정보</TabsTrigger>
                <TabsTrigger value="reservations">예약 내역</TabsTrigger>
                <TabsTrigger value="notifications">알림 기록</TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <dl className="grid grid-cols-[6rem_1fr] gap-y-2 text-sm">
                  <dt className="text-muted-foreground">전화번호</dt>
                  <dd>{customer.phone ?? "-"}</dd>
                  <dt className="text-muted-foreground">이메일</dt>
                  <dd>{customer.email ?? "-"}</dd>
                  <dt className="text-muted-foreground">카카오 ID</dt>
                  <dd>{customer.kakao_id ?? "-"}</dd>
                  <dt className="text-muted-foreground">선호 채널</dt>
                  <dd>
                    <Badge variant="secondary">{CHANNEL_LABEL[customer.preferred_channel]}</Badge>
                  </dd>
                </dl>
              </TabsContent>

              <TabsContent value="reservations">
                <ReservationList rows={reservations.filter((r) => r.customer_id === customer.id)} />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationList rows={notifications.filter((n) => n.customer_id === customer.id)} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ReservationList({ rows }: { rows: DetailReservation[] }) {
  if (rows.length === 0) return <p className="text-muted-foreground text-sm">예약이 없습니다.</p>
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.id} className="flex items-center gap-3 rounded-md border p-3 text-sm">
          <span className="font-medium">{r.resource_name}</span>
          <span className="text-muted-foreground">{r.starts_at_label}</span>
          <span className="ml-auto">
            <StatusBadge status={r.status} />
          </span>
        </li>
      ))}
    </ul>
  )
}

function NotificationList({ rows }: { rows: DetailNotification[] }) {
  if (rows.length === 0) return <p className="text-muted-foreground text-sm">알림 기록이 없습니다.</p>
  return (
    <ul className="space-y-2">
      {rows.map((n) => (
        <li key={n.id} className="flex items-center gap-3 rounded-md border p-3 text-sm">
          <span className="font-medium">{n.kind}</span>
          <span className="text-muted-foreground">{n.reservation_starts_at_label} 예약</span>
          <span className="text-muted-foreground">{n.created_at_label} 발송</span>
          <Badge variant="outline" className="ml-auto">{n.status}</Badge>
        </li>
      ))}
    </ul>
  )
}
