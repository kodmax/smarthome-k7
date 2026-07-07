import { ZoomStyle } from './types'
import { zoomCardTransition } from './zoomConstants'

function baseZoomStyle(overrides: Pick<ZoomStyle, 'bottom' | 'right' | 'left' | 'top'>): ZoomStyle {
  return {
    transition: zoomCardTransition,
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
