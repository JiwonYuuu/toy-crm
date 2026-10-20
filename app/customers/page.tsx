import { customerRepo } from "@/lib/repo"

const ORG_ID = "11111111-1111-1111-1111-111111111111"

export default async function CustomerPage() {
  const customers = await customerRepo.list(ORG_ID)
  return (
    <ul className="p-6">
      {customers.map((c) => (
        <li key={c.id}>
          {c.name} {c.phone}
        </li>
      ))}
    </ul>
  )
}
