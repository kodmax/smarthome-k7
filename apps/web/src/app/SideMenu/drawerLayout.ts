import { designTokens } from '@repo/design-tokens'
import {
  DRAWER_WIDTH,
  TOGGLE_CLOSED_OFFSET,
  TOGGLE_OFFSET_Y,
  TOGGLE_OPEN_OFFSET_X,
  TOGGLE_OPEN_OFFSET_Y,
} from './constants'

const { layout, breakpoint } = designTokens

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

export const toggleTopClosed = `${TOGGLE_CLOSED_OFFSET}px`

export const toggleLeftClosed = `${TOGGLE_CLOSED_OFFSET}px`

export const toggleTopOpen = {
  xs: `${layout.paddingMobile + TOGGLE_OFFSET_Y + TOGGLE_OPEN_OFFSET_Y}px`,
  md: `${layout.paddingTablet + TOGGLE_OFFSET_Y + TOGGLE_OPEN_OFFSET_Y}px`,
  lg: `${layout.paddingDesktop + TOGGLE_OFFSET_Y + TOGGLE_OPEN_OFFSET_Y}px`,
}

export const toggleLeft = (open: boolean) => ({
  xs: open ? `${layout.paddingMobile + DRAWER_WIDTH - TOGGLE_OPEN_OFFSET_X}px` : toggleLeftClosed,
  md: open ? `${layout.paddingTablet + DRAWER_WIDTH - TOGGLE_OPEN_OFFSET_X}px` : toggleLeftClosed,
  lg: open ? `${layout.paddingDesktop + DRAWER_WIDTH - TOGGLE_OPEN_OFFSET_X}px` : toggleLeftClosed,
})

export const drawerPaperSx = {
  width: DRAWER_WIDTH,
  top: drawerTop,
  left: drawerLeft,
  height: drawerHeight,
  borderRadius: `${designTokens.radius.xl}px`,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  boxShadow: designTokens.shadow.md,
  overflow: 'hidden',
  boxSizing: 'border-box',
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
