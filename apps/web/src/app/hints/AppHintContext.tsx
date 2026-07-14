import { createContext } from 'react'
import type { ActiveAppHint, AppHintContent } from './appHintTypes'

export type AppHintContextValue = {
  activeHint: ActiveAppHint | null
  showHint: (content: AppHintContent) => void
  hideHint: () => void
}

export const AppHintContext = createContext<AppHintContextValue>({
  activeHint: null,
  showHint: () => undefined,
  hideHint: () => undefined,
})
