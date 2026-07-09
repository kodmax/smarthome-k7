import { type MouseEventHandler, useCallback, useEffect, useMemo, useReducer } from 'react'
import { shouldIgnoreZoomClick } from './shouldIgnoreZoomClick'
import { ZOOM_AUTO_DISMISS_MS, ZOOM_EXPAND_DURATION_MS } from './zoomConstants'
import { expandedZoomStyle, zoomStyleFromRect } from './zoomStyles'
import { zoomReducer } from './reducer'

type UseZoomOptions = {
  allowZoom: boolean
  onZoom?: () => void
}

export function useValue({ allowZoom, onZoom }: UseZoomOptions) {
  const [state, dispatch] = useReducer(zoomReducer, { active: false })

  const startZoomOut = useCallback(() => {
    dispatch({ method: 'collapse' })

    setTimeout(() => {
      dispatch({ method: 'zoom-out' })
    }, ZOOM_EXPAND_DURATION_MS)
  }, [])

  const startZoomIn = useCallback((element: HTMLElement) => {
    dispatch({
      method: 'focus',
      style: zoomStyleFromRect(element.getBoundingClientRect()),
    })

    setTimeout(() => {
      dispatch({
        method: 'expand',
        style: expandedZoomStyle(),
      })
    }, 0)
  }, [])

  useEffect(() => {
    if (state.active && onZoom !== undefined) {
      onZoom()
    }
  }, [state.active, onZoom])

  useEffect(() => {
    if (!state.active) {
      return
    }

    const timeoutId = setTimeout(startZoomOut, ZOOM_EXPAND_DURATION_MS + ZOOM_AUTO_DISMISS_MS)

    return () => clearTimeout(timeoutId)
  }, [state.active, startZoomOut])

  const handleCardClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    ev => {
      if (!allowZoom || shouldIgnoreZoomClick(ev.target) || state.active) {
        return
      }

      startZoomIn(ev.currentTarget)
    },
    [allowZoom, startZoomIn, state.active],
  )

  const handleBackdropClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    ev => {
      if (!allowZoom || !state.active || ev.target !== ev.currentTarget) {
        return
      }

      startZoomOut()
    },
    [allowZoom, startZoomOut, state.active],
  )

  return useMemo(
    () => ({ state, handleCardClick, handleBackdropClick, startZoomOut }),
    [state, handleCardClick, handleBackdropClick, startZoomOut],
  )
}
