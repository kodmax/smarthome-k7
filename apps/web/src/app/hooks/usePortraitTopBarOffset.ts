import { useMediaQuery } from '@mui/material'
import { portraitMobileQuery } from '@repo/design-tokens'
import { useEffect } from 'react'
import { portraitTopBarOffset } from '../layout/portraitTopBarLayout'
import { useScrollReveal } from './useScrollReveal'

const portraitTopBarOffsetVar = '--portrait-top-bar-offset'

export const usePortraitTopBarOffset = (menuOpen: boolean) => {
  const isPortraitMobile = useMediaQuery(portraitMobileQuery)
  const topBarVisible = useScrollReveal()
  const showTopBar = isPortraitMobile && !menuOpen

  useEffect(() => {
    if (!showTopBar) {
      document.documentElement.style.removeProperty(portraitTopBarOffsetVar)
      return
    }

    document.documentElement.style.setProperty(portraitTopBarOffsetVar, portraitTopBarOffset)

    return () => {
      document.documentElement.style.removeProperty(portraitTopBarOffsetVar)
    }
  }, [showTopBar])

  return { isPortraitMobile, showTopBar, topBarVisible }
}
