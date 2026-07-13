import { designTokens, scaleBelow2xl } from '@repo/design-tokens'

const { layout, breakpoint, shadow } = designTokens
const sideMenu = designTokens.components.sideMenu

const containerCenterOffset = `max(0px, (100vw - ${layout.containerMax}px) / 2)`

const offsetFromContainerLeft = (value: number) => `calc(${containerCenterOffset} + ${value}px)`

export const drawerTop = {
  xs: `${layout.paddingMobile}px`,
  md: `${layout.paddingTablet}px`,
  lg: `${layout.paddingDesktop}px`,
}

export const drawerLeft = {
  xs: offsetFromContainerLeft(layout.paddingMobile),
  md: offsetFromContainerLeft(layout.paddingTablet),
  lg: offsetFromContainerLeft(layout.paddingDesktop),
}

export const drawerHeight = {
  xs: `calc(100dvh - ${layout.paddingMobile * 2}px)`,
  md: `calc(100dvh - ${layout.paddingTablet * 2}px)`,
  lg: `calc(100dvh - ${layout.paddingDesktop * 2}px)`,
}

export const toggleTopClosed = `${sideMenu.toggleClosedOffset}px`

export const toggleTopClosedBelow2xl = toggleTopClosed

export const toggleLeftClosed = offsetFromContainerLeft(sideMenu.toggleClosedOffset)

export const toggleLeftClosedBelow2xl = offsetFromContainerLeft(scaleBelow2xl(sideMenu.toggleClosedOffset))

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
