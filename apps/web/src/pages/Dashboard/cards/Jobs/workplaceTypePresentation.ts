import { WorkplaceType } from '@repo/types'
import { Building2, Home, type LucideIcon } from 'lucide-react'

export const WORKPLACE_TYPE_ICONS: Record<WorkplaceType, LucideIcon> = {
  remote: Home,
  office: Building2,
  hybrid: Building2,
}

export const WORKPLACE_TYPE_COLORS: Record<WorkplaceType, string> = {
  remote: 'var(--mui-palette-success-main)',
  office: 'var(--mui-palette-text-secondary)',
  hybrid: 'var(--mui-palette-warning-main)',
}
