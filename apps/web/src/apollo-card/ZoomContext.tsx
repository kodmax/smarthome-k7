import { createContext } from 'react'
import type { ZoomSetup } from './zoomReducer'

export const ZoomContext = createContext<ZoomSetup>({
  active: false,
})
