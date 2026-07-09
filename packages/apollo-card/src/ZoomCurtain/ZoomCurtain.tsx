import { styled } from '@mui/material'
import { useContext, useEffect, useMemo, type FC, type ReactNode } from 'react'
import { ZOOM_CURTAIN_Z_INDEX } from './zoomConstants'
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

export type ZoomCurtainFnProps = { zoom: boolean; zoomClose: () => void }
export type ZoomCurtainChildFn = (props: ZoomCurtainFnProps) => ReactNode

const ZoomCurtain: FC<{ children: ZoomCurtainChildFn; cardId: string; allowZoom: boolean; onZoom?: () => void }> = ({
  children,
  allowZoom,
  onZoom,
  cardId,
}) => {
  const { zoomedCardId, dispatch } = useContext(ZoomStateContext)
  const { state, handleCardClick, handleBackdropClick, startZoomOut } = useValue({ allowZoom, onZoom })

  useEffect(() => {
    state.active ? dispatch({ id: 'zoom-in', cardId }) : dispatch({ id: 'zoom-out' })
  }, [state, cardId])

  useEffect(() => {
    if (zoomedCardId === undefined && state.active && !state.transition) {
      startZoomOut()
    }
  }, [zoomedCardId, state, cardId, startZoomOut])

  const fnProps = useMemo<ZoomCurtainFnProps>(
    () => ({
      zoom: state.active,
      zoomClose: startZoomOut,
    }),
    [state, startZoomOut],
  )

  return (
    <>
      <Curtain
        data-testid='zoom-curtain'
        onClick={state.active ? handleBackdropClick : undefined}
        style={state.active ? { position: 'fixed', opacity: 0.9, zIndex: ZOOM_CURTAIN_Z_INDEX } : { width: '100%' }}
      />

      <div
        data-testid='zoom-wrapper'
        onClick={state.active ? handleBackdropClick : handleCardClick}
        style={state.active ? activeZoomWrapperStyle(state.style) : idleZoomWrapperStyle()}
      >
        {children(fnProps)}
      </div>
    </>
  )
}

export { ZoomCurtain }
