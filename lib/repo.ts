import type { CustomerDetailRow, CustomerInput, CustomerRow, NotificationRow, ReservationRow, ResourceRow } from "./types"
import { notImplemented } from "./not-implemented"
import { createClient } from "@/lib/supabase/server"

export interface ReservationRepo{
  list(orgId: string): Promise<ReservationRow[]>
    create(input: { org_id: string; customer_id: string; resource_id: string; starts_at: string }): Promise<{ id: string }>
    delete(id : string): Promise<{ deleted: number }>
}

export interface CustomerRepo{
  list(orgId: string): Promise<CustomerRow[]>
  listDetail(orgId: string): Promise<CustomerDetailRow[]>
  create(orgId: string, input: CustomerInput): Promise<CustomerRow>
  findByName(orgId: string, name: string): Promise<CustomerRow | null>
}

export interface ResourceRepo {
  list(orgId: string): Promise<ResourceRow[]>
  findByName(orgId: string, name: string): Promise<{ id: string; name: string } | null>
}

export interface NotificationRepo {
  list(orgId: string): Promise<NotificationRow[]>
}

export const reservationRepo: ReservationRepo = {
  async list(orgId) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("reservation")
      .select("id, customer_id, resource_id, starts_at, ends_at, status, customer:customer!reservation_customer_fk(name), resource:resource_id(name)")
      .eq("org_id", orgId)
      .order("starts_at")
    if (error) throw error
    return data.map((r) => ({
      id: r.id,
      customer_id: r.customer_id,
      resource_id: r.resource_id,
      starts_at: r.starts_at,
      ends_at: r.ends_at,
      status: r.status,
      customer_name: r.customer.name,
      resource_name: r.resource.name,
    }))
  },
  async create(input) {
    const supabase = await createClient()
    const startsAt = new Date(input.starts_at)
    const { data, error } = await supabase
      .from("reservation")
      .insert({
        org_id: input.org_id,
        customer_id: input.customer_id,
        resource_id: input.resource_id,
        starts_at: startsAt.toISOString(),
        ends_at: new Date(startsAt.getTime() + 60 * 60 * 1000).toISOString(),   // 예약 시간은 1시간
      })
      .select("id")
      .single()
    if (error) throw error
    return data
  },
  async delete(id) {
    const supabase = await createClient()
    const { data, error } = await supabase.from("reservation").delete().eq("id", id).select("id")
    if (error) throw error
    return { deleted: data.length }
  }
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
  async findByName(orgId, name){
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("customer")
      .select("id, name, phone")
      .eq("org_id",orgId)
      .eq("name", name)
      .maybeSingle()
    if (error) throw error
   return data
  },
  async listDetail(orgId) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("customer")
      .select("id, name, phone, email, kakao_id, preferred_channel")
      .eq("org_id", orgId)
      .order("name")
    if (error) throw error
    return data
  },
  async create(orgId, input) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("customer")
      .insert({ org_id: orgId, ...input })
      .select("id, name, phone")
      .single()
    if (error) throw error
    return data
  },
}

export const resourceRepo: ResourceRepo = {
  async list(orgId) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("resource")
      .select("id, name")
      .eq("org_id", orgId)
      .order("name")
    if (error) throw error
    return data
  },
  async findByName(orgId, name) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("resource")
      .select("id, name")
      .eq("org_id", orgId)
      .eq("name", name)
      .maybeSingle()
    if (error) throw error
    return data
  },
}

export const notificationRepo: NotificationRepo = {
  async list(orgId) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("notification")
      .select("id, kind, status, created_at, reservation:reservation_id(customer_id, starts_at)")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data.map((n) => ({
      id: n.id,
      customer_id: n.reservation.customer_id,
      kind: n.kind,
      status: n.status,
      created_at: n.created_at,
      reservation_starts_at: n.reservation.starts_at,
    }))
  },
}

export interface OrgRepo {
  get(orgId: string): Promise<{ id: string; name: string; timezone: string }>
}

export const orgRepo: OrgRepo = {
  async get(orgId) {
    const supabase = await createClient()
    const { data, error } = await supabase.from("organization").select("id, name, timezone").eq("id", orgId).single()
    if (error) throw error
    return data
  },
}
