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

function formatMustHaveGapsTooltip(gaps: string[]): string {
  return gaps.map(gap => `- ${gap}`).join('\n')
}

export const MustHaveGapsIndicator: FC<{ ad: Pick<JobAdsFeedItem, 'matchAnalysis'> }> = ({ ad }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const mustHaveGaps = ad.matchAnalysis?.mustHaveGaps

  if (mustHaveGaps === undefined) {
    return null
  }

  if (mustHaveGaps.length === 0) {
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

  const countLabel = labels.matchAnalysisMustHaveGapsIndicatorLabel.replace('{count}', String(mustHaveGaps.length))

  return (
    <Tooltip title={formatMustHaveGapsTooltip(mustHaveGaps)}>
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
        <span style={{ color: MUST_HAVE_GAPS_COLOR, fontSize: 'inherit' }}>{mustHaveGaps.length}</span>
      </span>
    </Tooltip>
  )
}
