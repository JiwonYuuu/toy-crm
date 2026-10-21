// app/customers/page.tsx
import { DataTable } from "@/components/data-table"
import { customerColumns } from "./columns"
import { customerRepo } from "@/lib/repo"

// 5번 시드 데이터의 "강남 클리닉" id. 12번에서 로그인한 사용자의 회사로 바꾼다.
const ORG_ID = "11111111-1111-1111-1111-111111111111"

export default async function CustomersPage() {
  const customers = await customerRepo.list(ORG_ID)
  return (
    <main className="p-6">
      <DataTable columns={customerColumns} data={customers} />
    </main>
  )
}
