import { Tooltip } from '@mui/material'
import { WorkplaceType } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { FC } from 'react'
import { useTranslations } from '@/i18n'
import { jobTitleIconSize } from './jobTitleIcons'
import { WORKPLACE_TYPE_COLORS, WORKPLACE_TYPE_ICONS } from './workplaceTypePresentation'

export const WorkplaceTypeIndicator: FC<{ workplaceType: WorkplaceType }> = ({ workplaceType }) => {
  const { t } = useTranslations()
  const label = t.dashboard.jobs.workplaceType[workplaceType]
  const Icon = WORKPLACE_TYPE_ICONS[workplaceType]

  return (
    <Tooltip title={label}>
      <span
        aria-label={label}
        style={{
          verticalAlign: 'middle',
          display: 'inline-flex',
        }}
      >
        <Icon
          size={jobTitleIconSize}
          strokeWidth={designTokens.icon.strokeWidth}
          aria-hidden
          style={{
            color: WORKPLACE_TYPE_COLORS[workplaceType],
          }}
        />
      </span>
    </Tooltip>
  )
}
