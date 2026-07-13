import type { ReactNode } from 'react'

export const CARD_HINT_AUTO_DISMISS_MS = 8_000

export type CardHintContent = {
  title: string
  description: string | string[]
  icon: ReactNode
}

export type ActiveCardHint = {
  id: number
  content: CardHintContent
}
