import type { Database } from "@/lib/database.types"

export type ReservationStatus = Database["public"]["Enums"]["reservation_status"]
export type Channel = Database["public"]["Enums"]["channel"]
export type NotificationStatus = Database["public"]["Enums"]["notification_status"]
export type AppRole = Database["public"]["Enums"]["app_role"]               // "owner" | "admin" | "staff" | "viewer"
export type AppPermission = Database["public"]["Enums"]["app_permission"]   // "reservation.create" | ...

export type ReservationRow = {
  id : string
  customer_id : string
  resource_id : string
  starts_at : string
  ends_at : string
  status : ReservationStatus
  customer_name : string
  resource_name : string
}

export type CustomerRow = {
  id : string
  name : string
  phone : string | null
}

export type ResourceRow = {
  id : string
  name : string
}

export type CustomerDetailRow = CustomerRow & {
  email : string | null
  kakao_id : string | null
  preferred_channel : Channel
}

export type CustomerInput = Pick<CustomerDetailRow, "name" | "phone" | "email" | "preferred_channel">

export type NotificationRow = {
  id : string
  customer_id : string
  kind : string
  status : NotificationStatus
  created_at : string
  reservation_starts_at : string
}
