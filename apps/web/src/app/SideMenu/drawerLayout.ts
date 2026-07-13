import { designTokens, scaleBelow2xl } from '@repo/design-tokens'

const { layout, breakpoint, shadow } = designTokens
const sideMenu = designTokens.components.sideMenu

export const drawerTop = {
  xs: `${layout.paddingMobile}px`,
  md: `${layout.paddingTablet}px`,
  lg: `${layout.paddingDesktop}px`,
}

export const drawerLeft = drawerTop

export const drawerHeight = {
  xs: `calc(100dvh - ${layout.paddingMobile * 2}px)`,
  md: `calc(100dvh - ${layout.paddingTablet * 2}px)`,
  lg: `calc(100dvh - ${layout.paddingDesktop * 2}px)`,
}

export const toggleTopClosed = `${sideMenu.toggleClosedOffset}px`

export const toggleTopClosedBelow2xl = `${scaleBelow2xl(sideMenu.toggleClosedOffset)}px`

export const toggleLeftClosed = `${sideMenu.toggleClosedOffset}px`

export const toggleLeftClosedBelow2xl = `${scaleBelow2xl(sideMenu.toggleClosedOffset)}px`

export const toggleTopOnDrawer = `${sideMenu.toggleOffsetY + sideMenu.toggleOpenOffsetY}px`

export const toggleTopOnDrawerBelow2xl = `${scaleBelow2xl(sideMenu.toggleOffsetY + sideMenu.toggleOpenOffsetY)}px`

export const toggleCenterFromDrawerRight = `calc(100% - ${sideMenu.toggleOpenOffsetX}px)`

export const toggleCenterFromDrawerRightBelow2xl = `calc(100% - ${scaleBelow2xl(sideMenu.toggleOpenOffsetX)}px)`

export const drawerPaperSx = {
  top: drawerTop,
  left: drawerLeft,
  height: drawerHeight,
  boxShadow: shadow.md,
  [`@media (min-width:${breakpoint.md}px)`]: {
    top: drawerTop.md,
    left: drawerLeft.md,
    height: drawerHeight.md,
  },
  [`@media (min-width:${breakpoint.lg}px)`]: {
    top: drawerTop.lg,
    left: drawerLeft.lg,
    height: drawerHeight.lg,
  },
}
