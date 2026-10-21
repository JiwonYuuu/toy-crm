import type { Channel, NotificationStatus } from "./types"

// 서버/클라이언트 컴포넌트 양쪽에서 쓰는 라벨. "use client" 파일에 두면 서버에서 못 쓴다
export const CHANNEL_LABEL = { kakao: "카카오톡", sms: "문자", email: "이메일" } satisfies Record<Channel, string>

export const NOTIFICATION_STATUS_LABEL = { pending: "대기", sent: "발송", failed: "실패" } satisfies Record<NotificationStatus, string>
