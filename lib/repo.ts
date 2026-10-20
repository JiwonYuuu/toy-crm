import type { CustomerRow, ReservationRow} from "./types"
import { notImplemented } from "./not-implemented"
import { createClient } from "@/lib/supabase/server"

export interface ReservationRepo{
  list(orgId: string): Promise<ReservationRow[]>
}

export interface CustomerRepo{
  list(orgId: string): Promise<CustomerRow[]>
}

export const reservationRepo: ReservationRepo = {
  async list(orgId) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("reservation")
      .select("id, starts_at, status, customer:customer!reservation_customer_fk(name), resource:resource_id(name)")
      .eq("org_id", orgId)
      .order("starts_at")
    if (error) throw error
    return data.map((r) => ({
      id: r.id,
      starts_at: r.starts_at,
      status: r.status,
      customer_name: r.customer.name,
      resource_name: r.resource.name,
    }))
  },
}

export const customerRepo: CustomerRepo = {
  async list(orgId) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("customer")
      .select("id, name, phone")
      .eq("org_id", orgId)
      .order("name")
    if (error) throw error
    return data
  },
}
