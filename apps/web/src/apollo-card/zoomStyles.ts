import { ZOOM_SCALE, zoomCardTransition } from './zoomConstants'
import type { ZoomStyle } from './zoomReducer'

function baseZoomStyle(overrides: Pick<ZoomStyle, 'bottom' | 'right' | 'left' | 'top'>): ZoomStyle {
  return {
    transition: zoomCardTransition,
    fontSize: 12 * ZOOM_SCALE,
    lineHeight: 1.2,
    ...overrides,
  }
}

export function zoomStyleFromRect(rect: DOMRect): ZoomStyle {
  return baseZoomStyle({
    bottom: window.innerHeight - rect.bottom,
    right: window.innerWidth - rect.right,
    left: rect.left,
    top: rect.top,
  })
}

export function expandedZoomStyle(): ZoomStyle {
  return baseZoomStyle({
    bottom: '10vh',
    top: '10vh',
    right: '5vw',
    left: '5vw',
  })
}

export function idleZoomWrapperStyle() {
  return { width: '100%', transition: zoomCardTransition }
}

export function activeZoomWrapperStyle(style: ZoomStyle) {
  return { position: 'fixed' as const, zIndex: 11, ...style }
}
