import { ZOOM_IGNORE_CLICK_TAGS } from './ZoomContext/zoomConstants'

export function shouldIgnoreZoomClick(target: EventTarget | null): boolean {
  for (let node: Node | null = target as Node; node; node = node.parentNode) {
    if (node instanceof HTMLElement) {
      if (
        ZOOM_IGNORE_CLICK_TAGS.includes(node.tagName as (typeof ZOOM_IGNORE_CLICK_TAGS)[number]) ||
        node.hasAttribute('data-no-close')
      ) {
        return true
      }
    }
  }

  return false
}
