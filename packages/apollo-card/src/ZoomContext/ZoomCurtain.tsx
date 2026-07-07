import { styled } from '@mui/material'
import { type FC, type ReactNode } from 'react'
import { useZoom } from './useZoom'
import { activeZoomWrapperStyle, idleZoomWrapperStyle } from './zoomStyles'
import { ZoomContext } from './ZoomContext'

export type { ZoomSetup } from './zoomReducer'
export { ZoomContext } from './ZoomContext'

const Curtain = styled('div')({
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  transition: 'opacity 1s ease-out',
  backgroundColor: 'black',
  opacity: 0,
})

const ZoomCurtain: FC<{ children: ReactNode; cardId: string; allowZoom: boolean; onZoom?: () => void }> = ({
  children,
  allowZoom,
  onZoom,
}) => {
  const { zoom, handleClick } = useZoom({ allowZoom, onZoom })

  return (
    <ZoomContext.Provider value={zoom}>
      <Curtain style={zoom.active ? { position: 'fixed', opacity: 0.9, zIndex: 10 } : { width: '100%' }} />

      <div onClick={handleClick} style={zoom.active ? activeZoomWrapperStyle(zoom.style) : idleZoomWrapperStyle()}>
        {children}
      </div>
    </ZoomContext.Provider>
  )
}

export { ZoomCurtain }
