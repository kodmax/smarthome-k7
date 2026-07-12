import { IconButton } from '@mui/material'
import { CollapseMenuIcon, MenuIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import {
  toggleLeftClosed,
  toggleLeftClosedBelow2xl,
  toggleLeftOpenFromWidth,
  toggleLeftOpenFromWidthBelow2xl,
  toggleTopClosed,
  toggleTopClosedBelow2xl,
  toggleTopOpen,
  toggleTopOpenBelow2xl,
} from './drawerLayout'

const { sideMenu } = designTokens.components
const { icon } = designTokens

type SideMenuToggleProps = {
  open: boolean
  drawerWidth: number
  onToggle: () => void
}

export const SideMenuToggle: FC<SideMenuToggleProps> = ({ open, drawerWidth, onToggle }) => {
  return (
    <IconButton
      aria-label={open ? 'Zwiń menu' : 'Otwórz menu'}
      aria-expanded={open}
      onClick={onToggle}
      data-side-menu-toggle=''
      data-open={open}
      sx={theme => ({
        position: 'fixed',
        top: open ? toggleTopOpen : toggleTopClosed,
        left: open ? toggleLeftOpenFromWidth(drawerWidth) : toggleLeftClosed,
        transform: open ? 'translateX(-50%)' : 'none',
        zIndex: open ? theme.zIndex.drawer + 1 : sideMenu.toggleClosedZIndex,
        [theme.breakpoints.down('2xl')]: {
          top: open ? toggleTopOpenBelow2xl : toggleTopClosedBelow2xl,
          left: open ? toggleLeftOpenFromWidthBelow2xl(drawerWidth) : toggleLeftClosedBelow2xl,
        },
      })}
    >
      {open ? (
        <CollapseMenuIcon size={icon.sizeXs} strokeWidth={icon.strokeWidth} />
      ) : (
        <MenuIcon size={icon.sizeXs} strokeWidth={icon.strokeWidth} />
      )}
    </IconButton>
  )
}
