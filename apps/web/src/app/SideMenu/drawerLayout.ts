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

export const toggleTopOpen = {
  xs: `${layout.paddingMobile + sideMenu.toggleOffsetY + sideMenu.toggleOpenOffsetY}px`,
  md: `${layout.paddingTablet + sideMenu.toggleOffsetY + sideMenu.toggleOpenOffsetY}px`,
  lg: `${layout.paddingDesktop + sideMenu.toggleOffsetY + sideMenu.toggleOpenOffsetY}px`,
}

export const toggleTopOpenBelow2xl = {
  xs: `${layout.paddingMobile + scaleBelow2xl(sideMenu.toggleOffsetY + sideMenu.toggleOpenOffsetY)}px`,
  md: `${layout.paddingTablet + scaleBelow2xl(sideMenu.toggleOffsetY + sideMenu.toggleOpenOffsetY)}px`,
  lg: `${layout.paddingDesktop + scaleBelow2xl(sideMenu.toggleOffsetY + sideMenu.toggleOpenOffsetY)}px`,
}

const toggleLeftOpen = (drawerWidth: number, toggleOffsetX: number) => ({
  xs: `${layout.paddingMobile + drawerWidth - toggleOffsetX}px`,
  md: `${layout.paddingTablet + drawerWidth - toggleOffsetX}px`,
  lg: `${layout.paddingDesktop + drawerWidth - toggleOffsetX}px`,
})

export const toggleLeftOpenFromWidth = (drawerWidth: number) => toggleLeftOpen(drawerWidth, sideMenu.toggleOpenOffsetX)

export const toggleLeftOpenFromWidthBelow2xl = (drawerWidth: number) =>
  toggleLeftOpen(drawerWidth, scaleBelow2xl(sideMenu.toggleOpenOffsetX))

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
