import type { ReactNode } from 'react'

export const APP_HINT_AUTO_DISMISS_MS = 8_000

export type AppHintContent = {
  title: string
  description: string | string[]
  icon: ReactNode
}

export type ActiveAppHint = {
  id: number
  content: AppHintContent
}
