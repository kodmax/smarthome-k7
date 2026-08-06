import { EmploymentType } from '@repo/types'
import { FilePen, FileText, GraduationCap, Layers, ShieldCheck, type LucideIcon } from 'lucide-react'

export const EMPLOYMENT_TYPE_ICONS: Record<EmploymentType, LucideIcon> = {
  permanent: ShieldCheck,
  b2b: FileText,
  any: Layers,
  uod: FilePen,
  mandate_contract: FilePen,
  contract: FileText,
  internship: GraduationCap,
  intern: GraduationCap,
}

export const EMPLOYMENT_TYPE_COLORS: Record<EmploymentType, string> = {
  permanent: 'var(--mui-palette-info-main)',
  b2b: 'var(--mui-palette-info-main)',
  any: 'var(--mui-palette-text-secondary)',
  uod: 'var(--mui-palette-text-secondary)',
  mandate_contract: 'var(--mui-palette-text-secondary)',
  contract: 'var(--mui-palette-text-secondary)',
  internship: 'var(--mui-palette-text-secondary)',
  intern: 'var(--mui-palette-text-secondary)',
}
