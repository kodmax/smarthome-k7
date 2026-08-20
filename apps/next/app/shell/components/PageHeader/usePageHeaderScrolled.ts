import { useEffect, useState } from 'react'

const SCROLL_OFFSET_THRESHOLD = 8

export const usePageHeaderScrolled = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const updateScrolled = () => {
      const nextScrolled = window.scrollY > SCROLL_OFFSET_THRESHOLD
      setScrolled(previous => (previous === nextScrolled ? previous : nextScrolled))
    }

    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })

    return () => window.removeEventListener('scroll', updateScrolled)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, [])

  return scrolled
}
