import { IconButton } from '@mui/material'
import { MenuIcon } from '@repo/assets'
import { designTokens, portraitMobileMediaQuery } from '@repo/design-tokens'
import { type FC } from 'react'
import { useMenu } from './MenuContext'
import { toggleLeftClosed, toggleLeftClosedBelow2xl, toggleTopClosed, toggleTopClosedBelow2xl } from './drawerLayout'

const { sideMenu } = designTokens.components
const { icon } = designTokens

export const SideMenuOpenToggle: FC<Record<string, never>> = () => {
  const { open, onOpen } = useMenu()

  if (open) {
    return null
  }

  return (
    <IconButton
      aria-label='Otwórz menu'
      aria-expanded={false}
      onClick={onOpen}
      data-side-menu-toggle=''
      data-open={false}
      sx={theme => ({
        position: 'fixed',
        top: toggleTopClosed,
        left: toggleLeftClosed,
        zIndex: sideMenu.toggleClosedZIndex,
        [theme.breakpoints.down('2xl')]: {
          top: toggleTopClosedBelow2xl,
          left: toggleLeftClosedBelow2xl,
        },
        [portraitMobileMediaQuery]: {
          display: 'none',
        },
      })}
    >
      <MenuIcon size={icon.sizeXs} strokeWidth={icon.strokeWidth} />
    </IconButton>
  )
}
