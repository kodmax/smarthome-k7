import { Box } from '@mui/material'
import { DashboardIcon, EnergyIcon, InfoIcon, SunMoonIcon, type StyledLucideIcon } from '@repo/assets'
import { type FC } from 'react'
import { SideMenuFooter } from './SideMenuFooter'
import { SideMenuHeader } from './SideMenuHeader'
import { SideMenuMain } from './SideMenuMain'

export type NavItem = {
  label: string
  path?: string
  icon: StyledLucideIcon
}

export type NavSection = {
  title?: string
  items: NavItem[]
}

const mainNavSections: NavSection[] = [
  {
    items: [
      { label: 'Pulpit główny', path: '/dashboard', icon: DashboardIcon },
      { label: 'Pomiar Energii', path: '/energy-meter', icon: EnergyIcon },
    ],
  },
  {
    title: 'Ustawienia',
    items: [{ label: 'Wygląd', path: '/appearance', icon: SunMoonIcon }],
  },
]

const footerNavItems: NavItem[] = [{ label: 'O aplikacji', icon: InfoIcon }]

type SideMenuContentProps = {
  onNavigate?: () => void
}

export const SideMenuContent: FC<SideMenuContentProps> = ({ onNavigate }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SideMenuHeader />
      <SideMenuMain sections={mainNavSections} onNavigate={onNavigate} />
      <SideMenuFooter items={footerNavItems} onNavigate={onNavigate} />
    </Box>
  )
}
