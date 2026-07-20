import { Box } from '@mui/material'
import { designTokens, portraitMobileMediaQuery } from '@repo/design-tokens'
import { type FC, type ReactNode, type Ref } from 'react'
import { pageHeaderLayout } from './pageHeaderLayout'

const { sideMenu } = designTokens.components
const { transition } = designTokens
const { bodyPadding, containerMax, portraitMobileSidePadding } = pageHeaderLayout

type PageHeaderShellProps = {
  headerRef: Ref<HTMLElement>
  visible: boolean
  scrolled: boolean
  children: ReactNode
}

export const PageHeaderShell: FC<PageHeaderShellProps> = ({ headerRef, visible, scrolled, children }) => (
  <Box
    component='header'
    ref={headerRef}
    aria-hidden={!visible}
    sx={theme => ({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: sideMenu.toggleClosedZIndex,
      backgroundColor: theme.vars.palette.background.default,
      boxShadow: scrolled && visible ? designTokens.shadow.sm : 'none',
      transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
      transition: `transform ${transition.normal}, box-shadow ${transition.normal}`,
      willChange: 'transform',
      pointerEvents: visible ? 'auto' : 'none',
      paddingTop: `calc(env(safe-area-inset-top) + ${bodyPadding.top}px)`,
    })}
  >
    <Box
      sx={{
        width: '100%',
        maxWidth: containerMax,
        mx: 'auto',
        px: `${bodyPadding.right}px`,
        [portraitMobileMediaQuery]: {
          px: `${portraitMobileSidePadding}px`,
        },
      }}
    >
      {children}
    </Box>
  </Box>
)
