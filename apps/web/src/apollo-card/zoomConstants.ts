export const ZOOM_EXPAND_DURATION_MS = 700
export const ZOOM_AUTO_DISMISS_MS = 300_000
export const ZOOM_SCALE = 2

export const ZOOM_IGNORE_CLICK_TAGS = ['A', 'BUTTON', 'INPUT'] as const

export const zoomCardTransition = `left ${ZOOM_EXPAND_DURATION_MS}ms ease-out, right ${ZOOM_EXPAND_DURATION_MS}ms ease-out, top ${ZOOM_EXPAND_DURATION_MS}ms ease-out, bottom ${ZOOM_EXPAND_DURATION_MS}ms ease-out`
