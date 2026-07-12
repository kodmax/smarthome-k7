import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { type NavItem } from './SideMenuContent'

const { sideMenu } = designTokens.components
const { icon } = designTokens

const activeNavBgSx = (theme: Theme) => ({ bgcolor: `${theme.vars.palette.temperature.main}24` })

type SideMenuNavItemProps = {
  item: NavItem
  onNavigate?: () => void
}

export const SideMenuNavItem: FC<SideMenuNavItemProps> = ({ item, onNavigate }) => {
  const { label, path, icon: Icon } = item
  const location = useLocation()
  const isActive = path !== undefined && location.pathname === path

  const sharedSx = isActive ? activeNavBgSx : undefined
  const textColor = isActive ? 'temperature.main' : 'text.secondary'
  const iconColor = isActive ? 'var(--mui-palette-temperature-main)' : 'var(--mui-palette-text-secondary)'

  if (path === undefined) {
    return (
      <ListItem disablePadding>
        <ListItemButton
          sx={theme => ({
            ...(isActive ? activeNavBgSx(theme) : {}),
            cursor: 'default',
          })}
        >
          <ListItemIcon>
            <Icon size={sideMenu.navIconSize} strokeWidth={icon.strokeWidth} color={iconColor} />
          </ListItemIcon>
          <ListItemText primary={label} slotProps={{ primary: { sx: { color: textColor } } }} />
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <ListItem disablePadding>
      <ListItemButton component={NavLink} to={path} onClick={onNavigate} sx={sharedSx}>
        <ListItemIcon>
          <Icon size={sideMenu.navIconSize} strokeWidth={icon.strokeWidth} color={iconColor} />
        </ListItemIcon>
        <ListItemText primary={label} slotProps={{ primary: { sx: { color: textColor } } }} />
      </ListItemButton>
    </ListItem>
  )
}
