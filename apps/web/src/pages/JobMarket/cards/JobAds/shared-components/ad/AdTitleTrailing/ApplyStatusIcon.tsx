import { JobApplyStatus } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { FC } from 'react'
import { jobTitleIconSize } from '../titleIconSize'
import { APPLY_STATUS_COLORS, APPLY_STATUS_ICONS } from './applyStatusPresentation'

export const ApplyStatusIcon: FC<{ status: JobApplyStatus; size?: number }> = ({ status, size = jobTitleIconSize }) => {
  const Icon = APPLY_STATUS_ICONS[status]

  return (
    <Icon
      size={size}
      strokeWidth={designTokens.icon.strokeWidth}
      aria-hidden
      style={{
        color: APPLY_STATUS_COLORS[status],
        flexShrink: 0,
      }}
    />
  )
}
