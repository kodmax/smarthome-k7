import { Box, Divider, List } from '@mui/material'
import { type FC } from 'react'
import { type NavItem } from './SideMenuContent'
import { SideMenuNavItem } from './SideMenuNavItem'
import { sideMenuScaleMedia } from './sideMenuScaleMedia'

const footerSx = () => ({
  pl: 2,
  pr: 4,
  pb: 2,
  [sideMenuScaleMedia]: {
    pl: 3,
    pr: 6,
    pb: 3,
  },
})

const footerDividerSx = () => ({
  mb: 2,
  [sideMenuScaleMedia]: {
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
