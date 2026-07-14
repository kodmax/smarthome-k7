import { type FC, type ReactNode, useCallback, useRef, useState } from 'react'
import { AppHintContext } from './AppHintContext'
import { type ActiveAppHint, type AppHintContent } from './appHintTypes'

export const AppHintProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [hint, setHint] = useState<ActiveAppHint | null>(null)
  const hintIdRef = useRef(0)

  const hideHint = useCallback(() => {
    setHint(null)
  }, [])

  const showHint = useCallback((content: AppHintContent) => {
    hintIdRef.current += 1
    setHint({ id: hintIdRef.current, content })
  }, [])

  return <AppHintContext.Provider value={{ activeHint: hint, showHint, hideHint }}>{children}</AppHintContext.Provider>
}
