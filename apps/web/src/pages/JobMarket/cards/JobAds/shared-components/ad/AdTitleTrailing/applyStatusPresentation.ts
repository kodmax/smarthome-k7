import { JobAdArchiveReason, JobApplyStatus } from '@repo/types'
import {
  Archive,
  Ban,
  Calendar,
  CircleCheck,
  CircleDashed,
  ClipboardX,
  Clock,
  CircleX,
  Gauge,
  MailCheck,
  Unplug,
  XCircle,
  Scale,
  type LucideIcon,
} from 'lucide-react'

export const APPLY_STATUS_ICONS: Record<JobApplyStatus, LucideIcon> = {
  'pending-review': CircleDashed,
  consider: Scale,
  applied: MailCheck,
  'no-response': Clock,
  interview: Calendar,
  archived: Archive,
}

export const APPLY_STATUS_COLORS: Record<JobApplyStatus, string> = {
  'pending-review': 'var(--mui-palette-text-disabled)',
  consider: 'var(--mui-palette-info-main)',
  applied: 'var(--mui-palette-success-main)',
  'no-response': 'var(--mui-palette-warning-main)',
  interview: 'var(--mui-palette-info-main)',
  archived: 'var(--mui-palette-text-secondary)',
}

export const ARCHIVE_REASON_ICONS: Record<JobAdArchiveReason, LucideIcon> = {
  'not-interested': Ban,
  'unmet-requirements': ClipboardX,
  'stack-mismatch': Unplug,
  'weak-match': Gauge,
  'no-response': Clock,
  rejected: XCircle,
  withdrawn: CircleX,
  'offer-accepted': CircleCheck,
}

export const ARCHIVE_REASON_COLORS: Record<JobAdArchiveReason, string> = {
  'not-interested': 'var(--mui-palette-error-main)',
  'unmet-requirements': 'var(--mui-palette-warning-main)',
  'stack-mismatch': 'var(--mui-palette-text-secondary)',
  'weak-match': 'var(--mui-palette-warning-main)',
  'no-response': 'var(--mui-palette-warning-main)',
  rejected: 'var(--mui-palette-error-main)',
  withdrawn: 'var(--mui-palette-text-secondary)',
  'offer-accepted': 'var(--mui-palette-success-main)',
}
