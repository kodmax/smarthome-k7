import { type RefObject, useLayoutEffect, useState } from 'react'

export const usePageHeaderHeight = (headerRef: RefObject<HTMLElement | null>, contentKey: string): number => {
  const [headerHeight, setHeaderHeight] = useState(0)

  useLayoutEffect(() => {
    const element = headerRef.current

    if (!element) {
      return
    }

    const updateHeight = () => {
      setHeaderHeight(element.offsetHeight)
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(element)

    return () => observer.disconnect()
  }, [contentKey, headerRef])

  return headerHeight
}
