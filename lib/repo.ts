import type { CustomerRow, ReservationRow} from "./types"
import { notImplemented } from "./not-implemented"

export interface ReservationRepo{
  list(orgId: string): Promise<ReservationRow[]>
}

export interface CustomerRepo{
  list(orgId: string): Promise<CustomerRow[]>
}

export const reservationRepo: ReservationRepo = {
  list: () => notImplemented("reservationRepo.list"),
}

export const customerRepo: CustomerRepo ={
  list: () => notImplemented("customerRepo.list"),
}
