import { Tooltip } from '@mui/material'
import { EmploymentType } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { FC } from 'react'
import { useTranslations } from '@/i18n'
import { jobTitleIconSize } from '../titleIconSize'
import { EMPLOYMENT_TYPE_COLORS, EMPLOYMENT_TYPE_ICONS } from './employmentTypePresentation'

export const EmploymentTypeIndicator: FC<{ employmentType: EmploymentType }> = ({ employmentType }) => {
  const { t } = useTranslations()
  const label = t.dashboard.jobAds.employmentType[employmentType]
  const Icon = EMPLOYMENT_TYPE_ICONS[employmentType]

  return (
    <Tooltip title={label}>
      <span
        aria-label={label}
        style={{
          verticalAlign: 'middle',
          display: 'inline-flex',
          flexShrink: 0,
        }}
      >
        <Icon
          size={jobTitleIconSize}
          strokeWidth={designTokens.icon.strokeWidth}
          aria-hidden
          style={{
            color: EMPLOYMENT_TYPE_COLORS[employmentType],
          }}
        />
      </span>
    </Tooltip>
  )
}
