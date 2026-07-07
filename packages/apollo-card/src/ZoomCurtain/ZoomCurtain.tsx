import { styled } from '@mui/material'
import { useContext, useEffect, type FC, type ReactNode } from 'react'
import { useValue } from './useValue'
import { activeZoomWrapperStyle, idleZoomWrapperStyle } from './zoomStyles'
import { ZoomStateContext } from '../ZoomStateProvider'

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
  cardId,
}) => {
  const { dispatch } = useContext(ZoomStateContext)
  const { zoom, handleCardClick, handleBackdropClick } = useValue({ allowZoom, onZoom })

  useEffect(() => {
    zoom.active ? dispatch({ id: 'zoom-in', cardId }) : dispatch({ id: 'zoom-out' })
  }, [zoom, cardId])

  return (
    <>
      <Curtain
        data-testid='zoom-curtain'
        onClick={zoom.active ? handleBackdropClick : undefined}
        style={zoom.active ? { position: 'fixed', opacity: 0.9, zIndex: 10 } : { width: '100%' }}
      />

      <div onClick={handleCardClick} style={zoom.active ? activeZoomWrapperStyle(zoom.style) : idleZoomWrapperStyle()}>
        {children}
      </div>
    </>
  )
}

export { ZoomCurtain }
