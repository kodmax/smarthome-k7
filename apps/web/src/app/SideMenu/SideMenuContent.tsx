import { Box } from '@mui/material'
import { DashboardIcon, EnergyIcon, InfoIcon, SunMoonIcon, type StyledLucideIcon } from '@repo/assets'
import { type FC, useMemo } from 'react'
import { useTranslations } from '@/i18n'
import { SideMenuFooter } from './SideMenuFooter'
import { SideMenuHeader } from './SideMenuHeader'
import { SideMenuMain } from './SideMenuMain'

export type NavItem = {
  id: string
  label: string
  path?: string
  icon: StyledLucideIcon
}

export type NavSection = {
  title?: string
  items: NavItem[]
}

type SideMenuContentProps = {
  onNavigate?: () => void
}

export const SideMenuContent: FC<SideMenuContentProps> = ({ onNavigate }) => {
  const { t } = useTranslations()

  const mainNavSections: NavSection[] = useMemo(
    () => [
      {
        items: [
          { id: 'dashboard', label: t.nav.dashboard, path: '/dashboard', icon: DashboardIcon },
          { id: 'energy-meter', label: t.nav.energyMeter, path: '/energy-meter', icon: EnergyIcon },
        ],
      },
      {
        title: t.nav.settings,
        items: [{ id: 'appearance', label: t.nav.appearance, path: '/appearance', icon: SunMoonIcon }],
      },
    ],
    [t],
  )

  const footerNavItems: NavItem[] = useMemo(() => [{ id: 'about', label: t.nav.about, icon: InfoIcon }], [t])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SideMenuHeader />
      <SideMenuMain sections={mainNavSections} onNavigate={onNavigate} />
      <SideMenuFooter items={footerNavItems} onNavigate={onNavigate} />
    </Box>
  )
}
