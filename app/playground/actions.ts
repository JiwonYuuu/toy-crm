// app/playground/actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { customerRepo } from "@/lib/repo"
import type { Channel } from "@/lib/types"

// 시드 데이터의 "강남 클리닉". page.tsx의 ORG_ID와 같다
const ORG_ID = "11111111-1111-1111-1111-111111111111"
const CHANNELS: Channel[] = ["kakao", "sms", "email"]

export type AddCustomerState = {
  ok: boolean
  // 같은 결과가 두 번 와도 useEffect가 다시 돌도록 매번 바뀌는 값
  at: number
  message?: string
  fieldErrors?: { name?: string; phone?: string }
  // React 19는 action이 끝나면 폼을 비운다. 실패했을 때 입력값을 되살리려고 돌려준다
  values?: { name: string; phone: string; email: string; preferred_channel: string }
}

export async function addCustomer(_prev: AddCustomerState, formData: FormData): Promise<AddCustomerState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    preferred_channel: String(formData.get("preferred_channel") ?? "sms"),
  }

  if (!values.name) {
    return { ok: false, at: Date.now(), fieldErrors: { name: "이름을 입력하세요." }, values }
  }
  const channel = CHANNELS.find((c) => c === values.preferred_channel)
  if (!channel) {
    return { ok: false, at: Date.now(), message: "알 수 없는 채널입니다.", values }
  }

  try {
    const customer = await customerRepo.create(ORG_ID, {
      name: values.name,
      phone: values.phone || null,
      email: values.email || null,
      preferred_channel: channel,
    })
    revalidatePath("/playground")
    return { ok: true, at: Date.now(), message: `${customer.name} 님을 추가했습니다.` }
  } catch (e) {
    // 23505: unique (org_id, phone) 위반
    if ((e as { code?: string }).code === "23505") {
      return { ok: false, at: Date.now(), fieldErrors: { phone: "이미 등록된 전화번호입니다." }, values }
    }
    return { ok: false, at: Date.now(), message: "저장하지 못했습니다.", values }
  }
}
