// app/playground/schema-accordion.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

type Column = { name: string; type: string; note?: string }
type TableSpec = { name: string; description: string; columns: Column[] }

// supabase/migrations/20261019105506_create_core_tables.sql 기준
const tables: TableSpec[] = [
  {
    name: "organization",
    description: "회사",
    columns: [
      { name: "id", type: "uuid", note: "PK" },
      { name: "name", type: "text" },
      { name: "timezone", type: "text", note: "기본값 Asia/Seoul" },
    ],
  },
  {
    name: "member",
    description: "직원: 로그인 사용자와 회사를 잇는 중간 테이블",
    columns: [
      { name: "user_id", type: "uuid", note: "PK, → auth.users" },
      { name: "org_id", type: "uuid", note: "PK, → organization" },
      { name: "role", type: "app_role", note: "owner · admin · staff · viewer" },
    ],
  },
  {
    name: "resource",
    description: "예약 대상: 방, 직원, 장비",
    columns: [
      { name: "id", type: "uuid", note: "PK" },
      { name: "org_id", type: "uuid", note: "→ organization" },
      { name: "name", type: "text" },
    ],
  },
  {
    name: "customer",
    description: "손님",
    columns: [
      { name: "id", type: "uuid", note: "PK" },
      { name: "org_id", type: "uuid", note: "→ organization" },
      { name: "name", type: "text" },
      { name: "phone", type: "text", note: "회사 안에서 unique" },
      { name: "email", type: "text" },
      { name: "kakao_id", type: "text" },
      { name: "preferred_channel", type: "channel", note: "kakao · sms · email" },
    ],
  },
  {
    name: "reservation",
    description: "예약",
    columns: [
      { name: "id", type: "uuid", note: "PK" },
      { name: "org_id", type: "uuid", note: "→ organization" },
      { name: "customer_id", type: "uuid", note: "(org_id, customer_id) → customer" },
      { name: "resource_id", type: "uuid", note: "→ resource" },
      { name: "starts_at", type: "timestamptz" },
      { name: "ends_at", type: "timestamptz", note: "starts_at보다 뒤" },
      { name: "status", type: "reservation_status", note: "booked · cancelled · completed" },
      { name: "created_at", type: "timestamptz" },
      { name: "updated_at", type: "timestamptz", note: "트리거로 갱신" },
    ],
  },
  {
    name: "notification",
    description: "알림",
    columns: [
      { name: "id", type: "uuid", note: "PK" },
      { name: "org_id", type: "uuid", note: "→ organization" },
      { name: "reservation_id", type: "uuid", note: "→ reservation (cascade)" },
      { name: "kind", type: "text" },
      { name: "status", type: "notification_status", note: "pending · sent · failed" },
      { name: "created_at", type: "timestamptz" },
    ],
  },
  {
    name: "audit_log",
    description: "변경 기록 (reservation, customer 트리거가 쌓음)",
    columns: [
      { name: "id", type: "uuid", note: "PK" },
      { name: "org_id", type: "uuid", note: "→ organization" },
      { name: "actor_id", type: "uuid", note: "auth.uid()" },
      { name: "action", type: "text", note: "INSERT · UPDATE · DELETE" },
      { name: "before", type: "jsonb" },
      { name: "after", type: "jsonb" },
      { name: "created_at", type: "timestamptz" },
    ],
  },
]

export function SchemaAccordion() {
  return (
    <Accordion type="multiple" className="mx-auto w-full max-w-2xl">
      {tables.map((table) => (
        <AccordionItem key={table.name} value={table.name}>
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <span className="font-mono">{table.name}</span>
              <span className="text-muted-foreground font-normal">
                {table.description}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1">
              {table.columns.map((col) => (
                <li key={col.name} className="flex items-center gap-2">
                  <span className="font-mono">{col.name}</span>
                  <Badge variant="secondary">{col.type}</Badge>
                  {col.note && (
                    <span className="text-muted-foreground text-xs">{col.note}</span>
                  )}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
