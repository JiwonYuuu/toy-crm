// components/div-toggle.tsx
"use client"
import { useState } from "react"

export function DivToggle() {
  const [on, setOn] = useState(false)   // on: 지금 값, setOn: 값을 바꾸는 함수
  return (
    <div onClick={() => setOn(!on)} className="w-fit cursor-pointer rounded border px-3 py-1">
      {on ? "켜짐" : "꺼짐"}
    </div>
  )
}
