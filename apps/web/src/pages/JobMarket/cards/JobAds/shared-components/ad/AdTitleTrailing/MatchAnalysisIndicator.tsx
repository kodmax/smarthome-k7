import { IconButton, Tooltip } from '@mui/material'
import { AiSparklesIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type JobAdsFeedItem } from '@repo/types'
import { type FC, useState } from 'react'
import { useTranslations } from '@/i18n'
import { JobAdCvMatchDialog } from '../../JobAdCvMatchDialog'
import { formatMatchAnalysisScoreValue } from '../../formatMatchAnalysisText'
import { jobTitleIconSize } from '../titleIconSize'

export const MatchAnalysisIndicator: FC<{ ad: Pick<JobAdsFeedItem, 'content' | 'meta' | 'matchAnalysisSummary'> }> = ({
  ad,
}) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const [open, setOpen] = useState(false)
  const matchAnalysisSummary = ad.matchAnalysisSummary

  if (matchAnalysisSummary === null) {
    return null
  }

  const isStale = !ad.meta.isCurrentCVUsed
  const staleColor = 'var(--mui-palette-text-disabled)'
  const scoreLabel = formatMatchAnalysisScoreValue(matchAnalysisSummary.score, labels)
  const tooltip = ad.meta.isCurrentCVUsed ? scoreLabel : labels.matchAnalysisStaleTooltip

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton
          aria-label={labels.viewMatchAnalysis}
          onClick={() => setOpen(true)}
          size='small'
          sx={{
            p: 0,
            gap: `${designTokens.space[1]}px`,
            verticalAlign: 'middle',
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 'inherit',
            lineHeight: 1,
          }}
        >
          <AiSparklesIcon
            size={jobTitleIconSize}
            strokeWidth={designTokens.icon.strokeWidth}
            glow={isStale ? 'off' : 'soft'}
            color={isStale ? staleColor : undefined}
            aria-hidden
          />
          <span
            style={{
              color: isStale ? staleColor : 'var(--mui-palette-text-secondary)',
              fontSize: 'inherit',
            }}
          >
            {scoreLabel}
          </span>
        </IconButton>
      </Tooltip>
      <JobAdCvMatchDialog
        open={open}
        onClose={() => setOpen(false)}
        adId={ad.content.id}
        isCurrentCVUsed={ad.meta.isCurrentCVUsed}
      />
    </>
  )
}
