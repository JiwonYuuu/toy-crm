// app/playground/clinic-dashboard.tsx
import Link from "next/link"
import {
  BellRing,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogoutButton } from "@/components/logout-button"
import { StatusBadge } from "@/components/status-badge"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { CHANNEL_LABEL, NOTIFICATION_STATUS_LABEL } from "@/lib/labels"
import type {
  Channel,
  CustomerDetailRow,
  NotificationRow,
  NotificationStatus,
  ReservationRow,
  ReservationStatus,
  ResourceRow,
} from "@/lib/types"
import { AddCustomerDialog } from "./add-customer-dialog"
import { PatientDirectory, type PatientRow } from "./patient-directory"

const HOUR_PX = 52
const DAY_MS = 86_400_000

// 날짜 키("yyyy-MM-dd")는 시간대가 없는 달력 날짜라서 UTC로 계산한다
const addDays = (key: string, n: number) =>
  new Date(Date.parse(`${key}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10)
const diffDays = (a: string, b: string) =>
  Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / DAY_MS)
const weekdayOf = (key: string) => new Date(`${key}T00:00:00Z`).getUTCDay()
const formatKey = (key: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("ko-KR", { ...options, timeZone: "UTC" }).format(new Date(`${key}T00:00:00Z`))

function relativeDay(key: string, today: string) {
  const diff = diffDays(key, today)
  if (diff === 0) return "오늘"
  if (diff === 1) return "내일"
  if (diff === -1) return "어제"
  return `${Number(key.slice(5, 7))}/${Number(key.slice(8))}(${formatKey(key, { weekday: "short" })})`
}

// 시각은 회사 시간대 기준으로 읽는다
function clock(timeZone: string) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone })
  const hm = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone })
  return {
    dayKey: (at: string | Date) => day.format(new Date(at)),
    time: (at: string | Date) => hm.format(new Date(at)),
    minutes: (at: string | Date) => {
      const [h, m] = hm.format(new Date(at)).split(":").map(Number)
      return h * 60 + m
    },
  }
}
type Clock = ReturnType<typeof clock>

const dayHref = (key: string) => `/playground?page=6&date=${key}`

type Props = {
  org: { name: string; timezone: string }
  userEmail: string | null
  date?: string
  customers: CustomerDetailRow[]
  reservations: ReservationRow[]
  resources: ResourceRow[]
  notifications: NotificationRow[]
}

export function ClinicDashboard({ org, userEmail, date, customers, reservations, resources, notifications }: Props) {
  const t = clock(org.timezone)
  const now = new Date()
  const today = t.dayKey(now)
  const selected = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today
  const selectedLabel = formatKey(selected, { month: "long", day: "numeric", weekday: "short" })

  const dayRows = reservations.filter((r) => t.dayKey(r.starts_at) === selected)
  const waiting = dayRows.filter((r) => r.status === "booked" && new Date(r.starts_at) > now)
  const count = (status: ReservationStatus) => dayRows.filter((r) => r.status === status).length
  const channels = (Object.keys(CHANNEL_LABEL) as Channel[])
    .map((c) => `${CHANNEL_LABEL[c]} ${customers.filter((x) => x.preferred_channel === c).length}`)
    .join(" · ")

  const upcoming = reservations.filter((r) => r.status !== "cancelled" && new Date(r.starts_at) > now)
  const past = reservations.filter((r) => new Date(r.starts_at) <= now).reverse()

  const patients: PatientRow[] = customers.map((c) => {
    const mine = reservations.filter((r) => r.customer_id === c.id && r.status !== "cancelled")
    const last = mine.at(-1)
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      channel: c.preferred_channel,
      reservationCount: mine.length,
      lastReservation: last ? `${relativeDay(t.dayKey(last.starts_at), today)} ${t.time(last.starts_at)}` : null,
    }
  })

  return (
    <div className="theme-clinic bg-background mx-auto flex max-w-7xl flex-col overflow-hidden rounded-2xl border shadow-sm md:flex-row">
      <Sidebar orgName={org.name} userEmail={userEmail} />

      <div className="min-w-0 flex-1">
        <header className="bg-card flex flex-wrap items-center justify-between gap-3 border-b px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">대시보드</h1>
            <p className="text-muted-foreground text-sm">
              {formatKey(today, { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <AddCustomerDialog noun="환자" />
          </div>
        </header>

        <div className="space-y-6 p-4 sm:p-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="예약"
              value={dayRows.length - count("cancelled")}
              unit="건"
              caption={`${selected === today ? "오늘" : selectedLabel} · 취소 제외`}
              icon={CalendarCheck}
              tone="bg-primary/10 text-primary"
            />
            <StatCard
              title="진료 대기"
              value={waiting.length}
              unit="명"
              caption={waiting[0] ? `다음 ${t.time(waiting[0].starts_at)} ${waiting[0].customer_name}` : "남은 예약 없음"}
              icon={Clock}
              tone="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            />
            <StatCard
              title="진료 완료"
              value={count("completed")}
              unit="건"
              caption={`취소 ${count("cancelled")}건`}
              icon={CircleCheck}
              tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title="등록 환자"
              value={customers.length}
              unit="명"
              caption={channels}
              icon={Users}
              tone="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            />
          </section>

          <div className="grid gap-6 xl:grid-cols-3">
            <ScheduleCard
              className="xl:col-span-2"
              t={t}
              now={now}
              today={today}
              selected={selected}
              reservations={reservations}
              resources={resources}
            />
            <div className="space-y-6">
              <ReservationsCard t={t} today={today} upcoming={upcoming} past={past} />
              <ReminderCard notifications={notifications} />
            </div>
          </div>

          <PatientDirectory patients={patients} />
        </div>
      </div>
    </div>
  )
}

const NAV = [
  { href: "/playground?page=6", label: "대시보드", icon: LayoutDashboard, active: true },
  { href: "/reservations", label: "예약 관리", icon: CalendarDays, active: false },
  { href: "/customers", label: "환자 관리", icon: Users, active: false },
]

function Sidebar({ orgName, userEmail }: { orgName: string; userEmail: string | null }) {
  return (
    <aside className="bg-card flex shrink-0 flex-col border-b md:w-60 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
          <Stethoscope className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="font-semibold">{orgName}</p>
          <p className="text-muted-foreground text-xs">예약 관리 시스템</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {NAV.map(({ href, label, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      {userEmail && (
        <div className="mt-auto hidden items-center gap-3 border-t p-4 md:flex">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {userEmail.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="min-w-0 flex-1 truncate text-sm">{userEmail}</p>
          <LogoutButton variant="ghost" size="icon" className="text-muted-foreground size-8" aria-label="로그아웃">
            <LogOut />
          </LogoutButton>
        </div>
      )}
    </aside>
  )
}

function StatCard({
  title,
  value,
  unit,
  caption,
  icon: Icon,
  tone,
}: {
  title: string
  value: number
  unit: string
  caption: string
  icon: LucideIcon
  tone: string
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
            {value}
            <span className="text-muted-foreground ml-1 text-base font-normal">{unit}</span>
          </p>
          <p className="text-muted-foreground mt-1 truncate text-xs">{caption}</p>
        </div>
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tone)}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}

const BLOCK_STYLE = {
  booked: "border-primary bg-primary/10",
  completed: "border-emerald-500 bg-emerald-500/10",
  cancelled: "border-muted-foreground/40 bg-muted text-muted-foreground line-through",
} satisfies Record<ReservationStatus, string>

function ScheduleCard({
  className,
  t,
  now,
  today,
  selected,
  reservations,
  resources,
}: {
  className?: string
  t: Clock
  now: Date
  today: string
  selected: string
  reservations: ReservationRow[]
  resources: ResourceRow[]
}) {
  const rows = reservations.filter((r) => t.dayKey(r.starts_at) === selected)
  const monday = addDays(selected, -((weekdayOf(selected) + 6) % 7))
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i))
  const perDay = new Map<string, number>()
  for (const r of reservations) {
    if (r.status === "cancelled") continue
    const key = t.dayKey(r.starts_at)
    perDay.set(key, (perDay.get(key) ?? 0) + 1)
  }

  // 자정을 넘기는 예약은 그날 24시에서 자른다
  const endOf = (r: ReservationRow) => (t.dayKey(r.ends_at) === selected ? t.minutes(r.ends_at) : 24 * 60)
  const startHour = Math.min(9, ...rows.map((r) => Math.floor(t.minutes(r.starts_at) / 60)))
  const endHour = Math.max(18, ...rows.map((r) => Math.ceil(endOf(r) / 60)))
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i)
  const toPx = (minutes: number) => ((minutes - startHour * 60) / 60) * HOUR_PX
  const nowMinutes = selected === today ? t.minutes(now) : null
  const showNow = nowMinutes !== null && nowMinutes >= startHour * 60 && nowMinutes <= endHour * 60
  const columns = { gridTemplateColumns: `repeat(${Math.max(resources.length, 1)}, minmax(0, 1fr))` }

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle>진료 일정</CardTitle>
          <CardDescription className="mt-1.5">
            {formatKey(selected, { month: "long", day: "numeric", weekday: "long" })} · 예약{" "}
            {rows.filter((r) => r.status !== "cancelled").length}건
          </CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <Button asChild variant="outline" size="icon" className="size-8">
            <Link href={dayHref(addDays(selected, -7))} scroll={false} aria-label="이전 주">
              <ChevronLeft />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={dayHref(today)} scroll={false}>
              오늘
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="size-8">
            <Link href={dayHref(addDays(selected, 7))} scroll={false} aria-label="다음 주">
              <ChevronRight />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 주간 날짜 선택 */}
        <div className="grid grid-cols-7 gap-1">
          {week.map((key) => {
            const n = perDay.get(key) ?? 0
            const isSelected = key === selected
            return (
              <Link
                key={key}
                href={dayHref(key)}
                scroll={false}
                aria-current={isSelected ? "date" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg py-2 text-xs transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  !isSelected && key === today && "text-primary ring-primary/40 ring-1 ring-inset",
                )}
              >
                <span
                  className={cn(
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground",
                    !isSelected && weekdayOf(key) === 0 && "text-rose-500",
                  )}
                >
                  {formatKey(key, { weekday: "short" })}
                </span>
                <span className="text-base font-semibold tabular-nums">{Number(key.slice(8))}</span>
                <span
                  className={cn(
                    "h-4 text-[11px]",
                    isSelected ? "text-primary-foreground/80" : n > 0 ? "text-primary" : "text-transparent",
                  )}
                >
                  {n > 0 ? `${n}건` : "·"}
                </span>
              </Link>
            )
          })}
        </div>

        {/* 진료실별 시간표 */}
        <div className="overflow-hidden rounded-lg border">
          <div className="bg-muted/50 flex border-b">
            <div className="w-14 shrink-0" />
            <div className="grid flex-1" style={columns}>
              {resources.map((res) => (
                <div key={res.id} className="flex items-center justify-between border-l px-3 py-2 text-sm">
                  <span className="font-medium">{res.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {rows.filter((r) => r.resource_id === res.id && r.status !== "cancelled").length}건
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {hours.map((h, i) => (
              <div key={h} className="flex" style={{ height: HOUR_PX }}>
                <div className="text-muted-foreground w-14 shrink-0 pr-2 pt-1 text-right text-[11px] tabular-nums">
                  {String(h).padStart(2, "0")}:00
                </div>
                <div className={cn("flex-1", i > 0 && "border-t border-dashed")} />
              </div>
            ))}

            <div className="absolute inset-y-0 left-14 right-0 grid" style={columns}>
              {resources.map((res) => (
                <div key={res.id} className="relative border-l">
                  {rows
                    .filter((r) => r.resource_id === res.id)
                    .map((r) => {
                      const start = t.minutes(r.starts_at)
                      return (
                        <div
                          key={r.id}
                          title={`${r.customer_name} · ${res.name} · ${t.time(r.starts_at)}–${t.time(r.ends_at)}`}
                          className={cn(
                            "absolute inset-x-1 overflow-hidden rounded-md border-l-[3px] px-2 py-1",
                            BLOCK_STYLE[r.status],
                          )}
                          style={{ top: toPx(start) + 1, height: Math.max(toPx(endOf(r)) - toPx(start) - 2, 24) }}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <p className="truncate text-xs font-semibold">{r.customer_name}</p>
                            <StatusBadge status={r.status} />
                          </div>
                          <p className="text-muted-foreground truncate text-[11px] tabular-nums">
                            {t.time(r.starts_at)}–{t.time(r.ends_at)}
                          </p>
                        </div>
                      )
                    })}
                </div>
              ))}
            </div>

            {showNow && (
              <div
                className="pointer-events-none absolute inset-x-0 flex -translate-y-1/2 items-center"
                style={{ top: toPx(nowMinutes) }}
              >
                <span className="w-14 shrink-0 pr-1.5 text-right text-[10px] font-semibold tabular-nums text-red-500">
                  {t.time(now)}
                </span>
                <span className="-ml-1 size-2 rounded-full bg-red-500" />
                <span className="h-px flex-1 bg-red-500" />
              </div>
            )}

            {rows.length === 0 && (
              <div className="pointer-events-none absolute inset-y-0 left-14 right-0 flex items-center justify-center">
                <p className="bg-card text-muted-foreground rounded-full border px-3 py-1 text-xs">
                  예약이 없는 날이에요
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReservationsCard({
  t,
  today,
  upcoming,
  past,
}: {
  t: Clock
  today: string
  upcoming: ReservationRow[]
  past: ReservationRow[]
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>예약 현황</CardTitle>
        <CardDescription>가까운 순서로 5건까지 보여줘요</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={upcoming.length > 0 ? "upcoming" : "past"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">다가오는 {upcoming.length}</TabsTrigger>
            <TabsTrigger value="past">지난 {past.length}</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <ReservationItems t={t} today={today} rows={upcoming.slice(0, 5)} empty="예정된 예약이 없어요" />
          </TabsContent>
          <TabsContent value="past">
            <ReservationItems t={t} today={today} rows={past.slice(0, 5)} empty="지난 예약이 없어요" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ReservationItems({ t, today, rows, empty }: { t: Clock; today: string; rows: ReservationRow[]; empty: string }) {
  if (rows.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-sm">
        <CalendarDays className="size-6 opacity-60" />
        {empty}
      </div>
    )
  }
  return (
    <ul className="divide-y">
      {rows.map((r) => (
        <li key={r.id} className="flex items-center gap-3 py-3">
          <div className="bg-muted flex w-16 shrink-0 flex-col items-center rounded-lg py-1.5">
            <span className="text-muted-foreground text-[11px]">{relativeDay(t.dayKey(r.starts_at), today)}</span>
            <span className="text-sm font-semibold tabular-nums">{t.time(r.starts_at)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{r.customer_name}</p>
            <p className="text-muted-foreground truncate text-xs">{r.resource_name}</p>
          </div>
          <StatusBadge status={r.status} />
        </li>
      ))}
    </ul>
  )
}

const REMINDER_TONE = {
  pending: "text-amber-600 dark:text-amber-400",
  sent: "text-emerald-600 dark:text-emerald-400",
  failed: "text-red-600 dark:text-red-400",
} satisfies Record<NotificationStatus, string>

function ReminderCard({ notifications }: { notifications: NotificationRow[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BellRing className="text-primary size-4" />
          리마인더
        </CardTitle>
        <CardDescription>예약 알림 발송 현황</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(NOTIFICATION_STATUS_LABEL) as NotificationStatus[]).map((s) => (
            <div key={s} className="bg-muted/60 rounded-lg px-3 py-2 text-center">
              <p className={cn("text-xl font-semibold tabular-nums", REMINDER_TONE[s])}>
                {notifications.filter((n) => n.status === s).length}
              </p>
              <p className="text-muted-foreground text-xs">{NOTIFICATION_STATUS_LABEL[s]}</p>
            </div>
          ))}
        </div>
        {notifications.length === 0 && (
          <p className="text-muted-foreground text-center text-xs">아직 발송 기록이 없어요</p>
        )}
      </CardContent>
    </Card>
  )
}
