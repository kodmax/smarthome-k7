import { Box, Divider, List } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { type FC } from 'react'
import { type NavItem } from './SideMenuContent'
import { SideMenuNavItem } from './SideMenuNavItem'

const below2xl = (theme: Theme) => theme.breakpoints.down('2xl')

const footerSx = (theme: Theme) => ({
  pl: 2,
  pr: 4,
  pb: 2,
  [below2xl(theme)]: {
    pl: 3,
    pr: 6,
    pb: 3,
  },
})

const footerDividerSx = (theme: Theme) => ({
  mb: 2,
  [below2xl(theme)]: {
    mb: 3,
  },
})

type SideMenuFooterProps = {
  items: NavItem[]
  onNavigate?: () => void
}

export const SideMenuFooter: FC<SideMenuFooterProps> = ({ items, onNavigate }) => (
  <Box sx={footerSx}>
    <Divider sx={footerDividerSx} />
    <List disablePadding>
      {items.map(item => (
        <SideMenuNavItem key={item.id} item={item} onNavigate={onNavigate} />
      ))}
    </List>
  </Box>
)
