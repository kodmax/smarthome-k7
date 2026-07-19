import { JobApplyStatus } from '@repo/types'
import {
  Ban,
  Calendar,
  CircleCheck,
  CircleDashed,
  Clock,
  CircleX,
  Handshake,
  MailCheck,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

export const APPLY_STATUS_ICONS: Record<JobApplyStatus, LucideIcon> = {
  'not-applied': CircleDashed,
  applied: MailCheck,
  'not-interested': Ban,
  rejected: XCircle,
  'no-response': Clock,
  interview: Calendar,
  offer: Handshake,
  'offer-accepted': CircleCheck,
  withdrawn: CircleX,
}

export const APPLY_STATUS_COLORS: Record<JobApplyStatus, string> = {
  'not-applied': 'var(--mui-palette-text-disabled)',
  applied: 'var(--mui-palette-success-main)',
  'not-interested': 'var(--mui-palette-text-secondary)',
  rejected: 'var(--mui-palette-error-main)',
  'no-response': 'var(--mui-palette-warning-main)',
  interview: 'var(--mui-palette-info-main)',
  offer: 'var(--mui-palette-warning-main)',
  'offer-accepted': 'var(--mui-palette-success-main)',
  withdrawn: 'var(--mui-palette-text-secondary)',
}
