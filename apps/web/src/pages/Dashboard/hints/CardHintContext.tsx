import { createContext } from 'react'
import type { CardHintContent } from './cardHintTypes'

export type CardHintContextValue = {
  hint: CardHintContent | null
  showHint: (content: CardHintContent) => void
  hideHint: () => void
}

export const CardHintContext = createContext<CardHintContextValue>({
  hint: null,
  showHint: () => undefined,
  hideHint: () => undefined,
})
