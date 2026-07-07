import { type FC, type ReactNode } from 'react'
import { ZoomStateContext } from './ZoomStateContext'
import { useValue } from './useValue'

export const ZoomStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const value = useValue()

  return <ZoomStateContext.Provider value={value}>{children}</ZoomStateContext.Provider>
}
