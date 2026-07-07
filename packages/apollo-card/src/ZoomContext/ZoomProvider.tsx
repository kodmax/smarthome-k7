import { type FC, type ReactNode } from 'react'
import { useZoom } from './useZoom'
import { ZoomContext } from './ZoomContext'

export type { ZoomSetup } from './zoomReducer'
export { ZoomContext } from './ZoomContext'

export const ZoomProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { zoom, handleClick } = useZoom({ allowZoom, onZoom })

  return (
    <ZoomContext.Provider value={zoom}>
      {children}
    </ZoomContext.Provider>
  )
}
