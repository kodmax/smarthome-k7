import { JobAdArchiveReason, JobApplyStatus } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { FC } from 'react'
import { jobTitleIconSize } from '../titleIconSize'
import {
  APPLY_STATUS_COLORS,
  APPLY_STATUS_ICONS,
  ARCHIVE_REASON_COLORS,
  ARCHIVE_REASON_ICONS,
} from './applyStatusPresentation'

export const ApplyStatusIcon: FC<{
  status: JobApplyStatus
  archiveReason?: JobAdArchiveReason | null
  size?: number
}> = ({ status, archiveReason = null, size = jobTitleIconSize }) => {
  const useArchiveReason = status === 'archived' && archiveReason !== null
  const Icon = useArchiveReason ? ARCHIVE_REASON_ICONS[archiveReason] : APPLY_STATUS_ICONS[status]
  const color = useArchiveReason ? ARCHIVE_REASON_COLORS[archiveReason] : APPLY_STATUS_COLORS[status]

  return (
    <Icon
      size={size}
      strokeWidth={designTokens.icon.strokeWidth}
      aria-hidden
      style={{
        color,
        flexShrink: 0,
      }}
    />
  )
}
