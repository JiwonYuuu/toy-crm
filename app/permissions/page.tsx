// app/permissions/page.tsx
import { getMe } from "@/lib/me"
import { hasPermission } from "@/lib/permissions"
import type { AppPermission } from "@/lib/types"

const PERMISSIONS: AppPermission[] = ["reservation.create", "reservation.delete", "member.manage"]

export default async function PermissionsPage() {
  const me = await getMe()
  const rows = await Promise.all(
    PERMISSIONS.map(async (p) => ({ permission: p, allowed: await hasPermission(me.role, p) })),
  )
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">내 역할: {me.role}</h1>
      <ul className="mt-4 space-y-1">
        {rows.map((r) => (
          <li key={r.permission}>
            {r.permission}: {r.allowed ? "O" : "X"}
          </li>
        ))}
      </ul>
    </main>
  )
}
