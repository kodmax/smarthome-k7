import { DashboardIcon, EnergyIcon, InfoIcon, SettingsIcon, type StyledLucideIcon } from '@repo/assets'

export type NavItem = {
  label: string
  path?: string
  icon: StyledLucideIcon
}

export type NavSection = {
  title?: string
  items: NavItem[]
}

export const mainNavSections: NavSection[] = [
  {
    items: [
      { label: 'Pulpit główny', path: '/dashboard', icon: DashboardIcon },
      { label: 'Pomiar Energii', path: '/energy-meter', icon: EnergyIcon },
    ],
  },
  {
    title: 'Ustawienia',
    items: [{ label: 'Wygląd', path: '/appearance', icon: SettingsIcon }],
  },
]

export const footerNavItems: NavItem[] = [{ label: 'O aplikacji', icon: InfoIcon }]
