import { type MouseEventHandler, useCallback, useEffect, useReducer } from 'react'
import { shouldIgnoreZoomClick } from './shouldIgnoreZoomClick'
import { ZOOM_AUTO_DISMISS_MS, ZOOM_EXPAND_DURATION_MS } from './zoomConstants'
import { expandedZoomStyle, zoomStyleFromRect } from './zoomStyles'
import { zoomReducer } from './zoomReducer'

type UseZoomOptions = {
  allowZoom: boolean
  onZoom?: () => void
}

export function useZoom({ allowZoom, onZoom }: UseZoomOptions) {
  const [zoom, dispatch] = useReducer(zoomReducer, { active: false })

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
    if (zoom.active && onZoom !== undefined) {
      onZoom()
    }
  }, [zoom.active, onZoom])

  useEffect(() => {
    if (!zoom.active) {
      return
    }

    const timeoutId = setTimeout(startZoomOut, ZOOM_EXPAND_DURATION_MS + ZOOM_AUTO_DISMISS_MS)

    return () => clearTimeout(timeoutId)
  }, [zoom.active, startZoomOut])

  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    ev => {
      if (!allowZoom || shouldIgnoreZoomClick(ev.target)) {
        return
      }

      if (zoom.active) {
        startZoomOut()
      } else {
        startZoomIn(ev.currentTarget)
      }
    },
    [allowZoom, startZoomIn, startZoomOut, zoom.active],
  )

  return { zoom, handleClick }
}
