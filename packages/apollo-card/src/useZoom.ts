import { useContext, useMemo } from 'react'
import { ZoomStateContext } from './ZoomStateProvider'

export const useZoom = (cardId: string): boolean => {
  const { zoomedCardId } = useContext(ZoomStateContext)

  return useMemo<boolean>(() => zoomedCardId === cardId, [zoomedCardId, cardId])
}
