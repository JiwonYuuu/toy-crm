// app/playground/page.tsx
import { ReservationCard } from "@/components/reservation-card"
import { Button } from "@/components/ui/button"
import { DivToggle } from "@/components/div-toggle"
import { Switch } from "@/components/ui/switch"
import { StatusBadge } from "@/components/status-badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { SchemaAccordion } from "./schema-accordion"
import { CustomerDetail } from "./customer-detail"
import { DateReservations } from "./date-reservations"
import { AddCustomerDialog } from "./add-customer-dialog"
import { ClinicDashboard } from "./clinic-dashboard"
import { Toaster } from "@/components/ui/sonner"
import { customerRepo, notificationRepo, orgRepo, reservationRepo, resourceRepo } from "@/lib/repo"
import { createClient } from "@/lib/supabase/server"

// 시드 데이터의 "강남 클리닉" (손님 3명)
const ORG_ID = "11111111-1111-1111-1111-111111111111"

const sample = {
  id: "1",
  customer_id: "1",
  resource_id: "1",
  starts_at: "2026-10-20 15:00",
  ends_at: "2026-10-20 16:00",
  status: "booked" as const,
  customer_name: "김민수",
  resource_name: "1번룸",
}

const LAST_PAGE = 6

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; date?: string }>
}) {
  const { page: raw, date } = await searchParams
  const page = Math.min(Math.max(Number(raw) || 1, 1), LAST_PAGE)

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 px-6 pt-12 pb-6">
        {page === 1 && <PageOne />}
        {page === 2 && <SchemaAccordion />}
        {page === 3 && <PageThree />}
        {page === 4 && <PageFour />}
        {page === 5 && <PageFive />}
        {page === 6 && <PageSix date={date} />}
      </div>
      <Toaster richColors />

      <Pagination className="py-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${page - 1}`}
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          {Array.from({ length: LAST_PAGE }, (_, i) => i + 1).map((n) => (
            <PaginationItem key={n}>
              <PaginationLink href={`?page=${n}`} isActive={n === page}>
                {n}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href={`?page=${page + 1}`}
              aria-disabled={page === LAST_PAGE}
              className={page === LAST_PAGE ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  )
}

function PageOne() {
  return (
    <div className="space-y-4">
      <ReservationCard reservation={sample} />
      <Button>기본 버튼</Button>
      <DivToggle />
      <Switch />
      <div className="flex gap-2">
        <StatusBadge status="booked" />
        <StatusBadge status="cancelled" />
        <StatusBadge status="completed" />
      </div>
    </div>
  )
}

async function PageThree() {
  const [org, customers, rows, notis] = await Promise.all([
    orgRepo.get(ORG_ID),
    customerRepo.listDetail(ORG_ID),
    reservationRepo.list(ORG_ID),
    notificationRepo.list(ORG_ID),
  ])
  const format = new Intl.DateTimeFormat("ko-KR", { dateStyle: "short", timeStyle: "short", timeZone: org.timezone })
  const label = (iso: string) => format.format(new Date(iso))
  const reservations = rows.map((r) => ({ ...r, starts_at_label: label(r.starts_at) }))
  const notifications = notis.map((n) => ({
    ...n,
    created_at_label: label(n.created_at),
    reservation_starts_at_label: label(n.reservation_starts_at),
  }))
  return <CustomerDetail customers={customers} reservations={reservations} notifications={notifications} />
}

async function PageFour() {
  const [org, rows] = await Promise.all([orgRepo.get(ORG_ID), reservationRepo.list(ORG_ID)])
  // en-CA 형식이 yyyy-MM-dd라서 날짜 키로 쓴다
  const dateKey = new Intl.DateTimeFormat("en-CA", { timeZone: org.timezone })
  const time = new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: org.timezone })
  const reservations = rows.map((r) => ({
    ...r,
    date_key: dateKey.format(new Date(r.starts_at)),
    time_label: time.format(new Date(r.starts_at)),
  }))
  return <DateReservations reservations={reservations} />
}

async function PageFive() {
  const customers = await customerRepo.listDetail(ORG_ID)
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">손님 {customers.length}명</h2>
        <AddCustomerDialog />
      </div>
      <ul className="space-y-2">
        {customers.map((c) => (
          <li key={c.id} className="flex items-center gap-3 rounded-md border p-3 text-sm">
            <span className="font-medium">{c.name}</span>
            <span className="text-muted-foreground">{c.phone ?? "-"}</span>
            <span className="text-muted-foreground ml-auto">{c.preferred_channel}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

async function PageSix({ date }: { date?: string }) {
  const supabase = await createClient()
  const [org, customers, reservations, resources, notifications, { data }] = await Promise.all([
    orgRepo.get(ORG_ID),
    customerRepo.listDetail(ORG_ID),
    reservationRepo.list(ORG_ID),
    resourceRepo.list(ORG_ID),
    notificationRepo.list(ORG_ID),
    supabase.auth.getClaims(),
  ])
  return (
    <ClinicDashboard
      org={org}
      userEmail={data?.claims.email ?? null}
      date={date}
      customers={customers}
      reservations={reservations}
      resources={resources}
      notifications={notifications}
    />
  )
}
