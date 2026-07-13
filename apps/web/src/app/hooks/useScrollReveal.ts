import { useEffect, useRef, useState } from 'react'

const SCROLL_DELTA_THRESHOLD = 8

export const useScrollReveal = () => {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const updateVisibility = () => {
      ticking.current = false
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY.current

      if (Math.abs(delta) < SCROLL_DELTA_THRESHOLD) {
        return
      }

      const nextVisible = !(delta > 0 && currentScrollY > SCROLL_DELTA_THRESHOLD)

      setVisible(previous => (previous === nextVisible ? previous : nextVisible))
      lastScrollY.current = currentScrollY
    }

    const onScroll = () => {
      if (ticking.current) {
        return
      }

      ticking.current = true
      requestAnimationFrame(updateVisibility)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return visible
}
