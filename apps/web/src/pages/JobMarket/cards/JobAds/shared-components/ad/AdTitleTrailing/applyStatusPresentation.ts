import { JobApplyStatus } from '@repo/types'
import {
  Archive,
  Ban,
  Calendar,
  CircleCheck,
  CircleDashed,
  ClipboardX,
  Clock,
  CircleX,
  Handshake,
  MailCheck,
  Unplug,
  XCircle,
  Scale,
  type LucideIcon,
} from 'lucide-react'

export const APPLY_STATUS_ICONS: Record<JobApplyStatus, LucideIcon> = {
  'not-applied': CircleDashed,
  consider: Scale,
  applied: MailCheck,
  'not-interested': Ban,
  'unmet-requirements': ClipboardX,
  'stack-mismatch': Unplug,
  rejected: XCircle,
  'no-response': Clock,
  interview: Calendar,
  offer: Handshake,
  'offer-accepted': CircleCheck,
  withdrawn: CircleX,
  archived: Archive,
}

export const APPLY_STATUS_COLORS: Record<JobApplyStatus, string> = {
  'not-applied': 'var(--mui-palette-text-disabled)',
  consider: 'var(--mui-palette-info-main)',
  applied: 'var(--mui-palette-success-main)',
  'not-interested': 'var(--mui-palette-error-main)',
  'unmet-requirements': 'var(--mui-palette-warning-main)',
  'stack-mismatch': 'var(--mui-palette-text-secondary)',
  rejected: 'var(--mui-palette-error-main)',
  'no-response': 'var(--mui-palette-warning-main)',
  interview: 'var(--mui-palette-info-main)',
  offer: 'var(--mui-palette-warning-main)',
  'offer-accepted': 'var(--mui-palette-success-main)',
  withdrawn: 'var(--mui-palette-text-secondary)',
  archived: 'var(--mui-palette-text-secondary)',
}
