// app/playground/add-customer-dialog.tsx
"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { addCustomer, type AddCustomerState } from "./actions"

const initial: AddCustomerState = { ok: false, at: 0 }

// noun: 화면마다 부르는 이름이 달라서 받는다 (5페이지 "손님", 6페이지 "환자")
export function AddCustomerDialog({ noun = "손님" }: { noun?: string }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(addCustomer, initial)

  useEffect(() => {
    if (state.at === 0) return
    if (state.ok) {
      toast.success(state.message)
      setOpen(false)
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus />
          {noun} 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{noun} 추가</DialogTitle>
          <DialogDescription>강남 클리닉에 새 {noun} 정보를 등록합니다.</DialogDescription>
        </DialogHeader>

        {/* key: 결과가 바뀔 때마다 폼을 새로 그려 defaultValue가 다시 적용되게 한다 */}
        <form key={state.at} action={formAction} className="space-y-4">
          <Field label="이름" name="name" required defaultValue={state.values?.name} error={state.fieldErrors?.name} />
          <Field label="전화번호" name="phone" placeholder="+821012345678" defaultValue={state.values?.phone} error={state.fieldErrors?.phone} />
          <Field label="이메일" name="email" type="email" defaultValue={state.values?.email} />
          <div className="space-y-2">
            <Label htmlFor="preferred_channel">선호 채널</Label>
            <NativeSelect id="preferred_channel" name="preferred_channel" defaultValue={state.values?.preferred_channel ?? "sms"}>
              <NativeSelectOption value="sms">문자</NativeSelectOption>
              <NativeSelectOption value="kakao">카카오톡</NativeSelectOption>
              <NativeSelectOption value="email">이메일</NativeSelectOption>
            </NativeSelect>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">취소</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  name,
  error,
  ...props
}: { label: string; name: string; error?: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} aria-invalid={!!error} {...props} />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
