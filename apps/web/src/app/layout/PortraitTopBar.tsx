import { Box, IconButton } from '@mui/material'
import { MenuIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import {
  portraitTopBarBottomPadding,
  portraitTopBarContentHeight,
  portraitTopBarSidePadding,
  portraitTopBarTopPadding,
} from './portraitTopBarLayout'
import { useMenu } from '../SideMenu/MenuContext'

const { sideMenu } = designTokens.components
const { icon, radius, transition } = designTokens

type PortraitTopBarProps = {
  visible: boolean
}

export const PortraitTopBar: FC<PortraitTopBarProps> = ({ visible }) => {
  const { onOpen } = useMenu()

  return (
    <Box
      component='header'
      aria-hidden={!visible}
      sx={theme => ({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: sideMenu.toggleClosedZIndex,
        display: 'flex',
        alignItems: 'center',
        paddingTop: `calc(env(safe-area-inset-top) + ${portraitTopBarTopPadding}px)`,
        paddingLeft: `${portraitTopBarSidePadding}px`,
        paddingRight: theme.spacing(2),
        paddingBottom: `${portraitTopBarBottomPadding}px`,
        minHeight: portraitTopBarContentHeight,
        backgroundColor: theme.vars.palette.background.paper,
        borderBottom: '1px solid',
        borderColor: theme.vars.palette.divider,
        boxShadow: designTokens.shadow.sm,
        transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
        transition: `transform ${transition.normal}`,
        willChange: 'transform',
        pointerEvents: visible ? 'auto' : 'none',
      })}
    >
      <IconButton
        size='medium'
        aria-label='Otwórz menu'
        aria-expanded={false}
        onClick={onOpen}
        sx={theme => ({
          border: '1px solid',
          borderColor: sideMenu.toggleClosedBorderColor,
          borderRadius: `${radius.md}px`,
          backgroundColor: theme.vars.palette.background.paper,
          '&:hover': {
            backgroundColor: theme.vars.palette.surfaceElevated.main,
          },
        })}
      >
        <MenuIcon size={icon.sizeSm} strokeWidth={icon.strokeWidth} />
      </IconButton>
    </Box>
  )
}
