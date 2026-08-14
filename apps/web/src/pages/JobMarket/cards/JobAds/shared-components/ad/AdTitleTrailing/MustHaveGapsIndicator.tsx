import { Tooltip } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type JobAdsFeedItem } from '@repo/types'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'
import { jobTitleIconSize } from '../titleIconSize'

const MUST_HAVE_GAPS_COLOR = 'var(--mui-palette-error-main)'
const MUST_HAVE_GAPS_CLEAR_COLOR = 'var(--mui-palette-success-main)'

const indicatorStyle = {
  verticalAlign: 'middle',
  display: 'inline-flex',
  alignItems: 'center',
  gap: `${designTokens.space[1]}px`,
  fontSize: 'inherit',
  lineHeight: 1,
} as const

export const MustHaveGapsIndicator: FC<{ ad: Pick<JobAdsFeedItem, 'matchAnalysisSummary'> }> = ({ ad }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const mustHaveGapsCount = ad.matchAnalysisSummary?.mustHaveGapsCount

  if (mustHaveGapsCount === undefined) {
    return null
  }

  if (mustHaveGapsCount === 0) {
    return (
      <Tooltip title={labels.matchAnalysisMustHaveGapsClearLabel}>
        <span aria-label={labels.matchAnalysisMustHaveGapsClearLabel} style={indicatorStyle}>
          <CircleCheck
            size={jobTitleIconSize}
            strokeWidth={designTokens.icon.strokeWidth}
            aria-hidden
            style={{
              color: MUST_HAVE_GAPS_CLEAR_COLOR,
              flexShrink: 0,
            }}
          />
        </span>
      </Tooltip>
    )
  }

  const countLabel = labels.matchAnalysisMustHaveGapsIndicatorLabel.replace('{count}', String(mustHaveGapsCount))

  return (
    <Tooltip title={countLabel}>
      <span aria-label={countLabel} style={indicatorStyle}>
        <CircleAlert
          size={jobTitleIconSize}
          strokeWidth={designTokens.icon.strokeWidth}
          aria-hidden
          style={{
            color: MUST_HAVE_GAPS_COLOR,
            flexShrink: 0,
          }}
        />
        <span style={{ color: MUST_HAVE_GAPS_COLOR, fontSize: 'inherit' }}>{mustHaveGapsCount}</span>
      </span>
    </Tooltip>
  )
}
