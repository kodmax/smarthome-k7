import { IconButton } from '@mui/material'
import { CollapseMenuIcon, MenuIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { TOGGLE_CLOSED_BORDER_COLOR, TOGGLE_CLOSED_SIZE, TOGGLE_CLOSED_Z_INDEX, TOGGLE_OPEN_SIZE } from './constants'
import { toggleLeft, toggleLeftClosed, toggleTopClosed, toggleTopOpen } from './drawerLayout'

type SideMenuToggleProps = {
  open: boolean
  onToggle: () => void
}

export const SideMenuToggle: FC<SideMenuToggleProps> = ({ open, onToggle }) => {
  return (
    <IconButton
      aria-label={open ? 'Zwiń menu' : 'Otwórz menu'}
      aria-expanded={open}
      onClick={onToggle}
      sx={{
        position: 'fixed',
        top: open ? toggleTopOpen : toggleTopClosed,
        left: open ? toggleLeft(open) : toggleLeftClosed,
        transform: open ? 'translateX(-50%)' : 'none',
        zIndex: theme => (open ? theme.zIndex.drawer + 1 : TOGGLE_CLOSED_Z_INDEX),
        width: open ? TOGGLE_OPEN_SIZE : TOGGLE_CLOSED_SIZE,
        height: open ? TOGGLE_OPEN_SIZE : TOGGLE_CLOSED_SIZE,
        minWidth: 0,
        px: 0,
        borderRadius: open ? `${designTokens.radius.sm}px` : `${designTokens.radius.md}px`,
        border: '1px solid',
        borderColor: open ? 'divider' : TOGGLE_CLOSED_BORDER_COLOR,
        bgcolor: 'background.paper',
        boxShadow: open ? designTokens.shadow.sm : designTokens.shadow.card,
        transition: `left ${designTokens.transition.normal}, top ${designTokens.transition.normal}, width ${designTokens.transition.normal}, height ${designTokens.transition.normal}, border-radius ${designTokens.transition.normal}`,
        '&:hover': {
          bgcolor: 'surfaceElevated.main',
        },
      }}
    >
      {open ? (
        <CollapseMenuIcon size={designTokens.icon.sizeXs} strokeWidth={designTokens.icon.strokeWidth} />
      ) : (
        <MenuIcon size={designTokens.icon.sizeXs} strokeWidth={designTokens.icon.strokeWidth} />
      )}
    </IconButton>
  )
}
