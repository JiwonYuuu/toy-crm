import type { Database } from "@/lib/database.types"

export type ReservationStatus = Database["public"]["Enums"]["reservation_status"]

export type ReservationRow = {
  id : string
  starts_at : string
  status : ReservationStatus
  customer_name : string
  resource_name : string
}

export type CustomerRow = {
  id : string
  name : string
  phone : string | null
}
