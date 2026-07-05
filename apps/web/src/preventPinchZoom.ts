/** Safari iOS: blokuje pinch-to-zoom bez lockowania viewportu. */
export function preventPinchZoom() {
  const block = (event: Event) => event.preventDefault()

  for (const type of ['gesturestart', 'gesturechange', 'gestureend'] as const) {
    document.addEventListener(type, block, { passive: false })
  }
}
