// app/customers/page.tsx
import { DataTable } from "@/components/data-table"
import { customerColumns } from "./columns"
import { customerRepo } from "@/lib/repo"
import { getMe } from "@/lib/me"

export default async function CustomersPage() {
  const { orgId } = await getMe()
  const customers = await customerRepo.list(orgId)
  return (
    <main className="p-6">
      <DataTable columns={customerColumns} data={customers} />
    </main>
  )
}
