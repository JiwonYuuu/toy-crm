// lib/notify/index.ts
import { makeSendReminder } from "./send-reminder"
import { kakaoNotifier } from "./channels/kakao"
import { smsNotifier } from "./channels/sms"
import { emailNotifier } from "./channels/email"
import { lineNotifier } from "./channels/line"

export const sendReminder = makeSendReminder({ kakao: kakaoNotifier, sms: smsNotifier, email: emailNotifier, line: lineNotifier })
