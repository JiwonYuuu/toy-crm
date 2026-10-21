// lib/table.ts
import { tableFeatures } from "@tanstack/react-table"

// 이 앱의 표가 쓰는 기능 목록. 지금은 기본 기능만 쓴다.
export const features = tableFeatures({})
export type Features = typeof features
