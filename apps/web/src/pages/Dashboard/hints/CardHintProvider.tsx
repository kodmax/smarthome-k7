import { type FC, type ReactNode, useCallback, useRef, useState } from 'react'
import { CardHintContext } from './CardHintContext'
import { CardHintOverlay } from './CardHintOverlay'
import { CARD_HINT_AUTO_DISMISS_MS, type ActiveCardHint, type CardHintContent } from './cardHintTypes'

export const CardHintProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [hint, setHint] = useState<ActiveCardHint | null>(null)
  const hintIdRef = useRef(0)

  const hideHint = useCallback(() => {
    setHint(null)
  }, [])

  const showHint = useCallback((content: CardHintContent) => {
    hintIdRef.current += 1
    setHint({ id: hintIdRef.current, content })
  }, [])

  return (
    <CardHintContext.Provider value={{ hint: hint?.content ?? null, showHint, hideHint }}>
      {children}
      <CardHintOverlay hint={hint} dismissMs={CARD_HINT_AUTO_DISMISS_MS} onDismiss={hideHint} />
    </CardHintContext.Provider>
  )
}
