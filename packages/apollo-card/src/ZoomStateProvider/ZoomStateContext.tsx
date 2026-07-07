import { createContext } from 'react'
import { ZoomStateWithDispatch } from './types'

export const ZoomStateContext = createContext<ZoomStateWithDispatch>({
  zoomedCardId: undefined,
  dispatch: () => void 0,
})
