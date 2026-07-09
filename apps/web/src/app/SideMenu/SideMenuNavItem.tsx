import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ACTIVE_NAV_BG, ACTIVE_NAV_COLOR } from './constants'
import { type NavItem } from './navItems'

const { font, icon, space } = designTokens

const navTitleSx = {
  fontSize: font.h3.size,
  fontWeight: font.h3.weight,
  lineHeight: font.h3.lineHeight,
}

type SideMenuNavItemProps = {
  item: NavItem
  onNavigate?: () => void
}

export const SideMenuNavItem: FC<SideMenuNavItemProps> = ({ item, onNavigate }) => {
  const { label, path, icon: Icon } = item
  const location = useLocation()
  const isActive = path !== undefined && location.pathname === path

  const sharedSx = {
    borderRadius: `${designTokens.radius.md}px`,
    py: 1.5,
    gap: space[2],
    ...(isActive
      ? {
          bgcolor: ACTIVE_NAV_BG,
        }
      : {}),
  }

  const iconSlot = (
    <ListItemIcon sx={{ minWidth: icon.sizeSm }}>
      <Icon
        size={icon.sizeSm}
        strokeWidth={icon.strokeWidth}
        color={isActive ? ACTIVE_NAV_COLOR : 'var(--mui-palette-text-secondary)'}
      />
    </ListItemIcon>
  )

  if (path === undefined) {
    return (
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton sx={{ ...sharedSx, cursor: 'default' }}>
          <ListItemIcon sx={{ minWidth: icon.sizeSm }}>
            <Icon size={icon.sizeSm} strokeWidth={icon.strokeWidth} color='var(--mui-palette-text-secondary)' />
          </ListItemIcon>
          <ListItemText
            primary={label}
            slotProps={{ primary: { sx: { ...navTitleSx, color: 'text.secondary', fontWeight: font.h3.weight } } }}
          />
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton component={NavLink} to={path} onClick={onNavigate} sx={sharedSx}>
        {iconSlot}
        <ListItemText
          primary={label}
          slotProps={{
            primary: {
              sx: {
                ...navTitleSx,
                color: isActive ? ACTIVE_NAV_COLOR : 'text.secondary',
                fontWeight: font.h3.weight,
              },
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}
