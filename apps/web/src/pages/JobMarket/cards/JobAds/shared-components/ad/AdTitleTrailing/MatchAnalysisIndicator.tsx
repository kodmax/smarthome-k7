import { IconButton, Tooltip } from '@mui/material'
import { AiSparklesIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type JobAdMatchAnalysis } from '@repo/types'
import { type FC, useState } from 'react'
import { CvPreviewDialog } from '@/pages/JobMarket/cards/Cv/CvPreviewDialog'
import { useTranslations } from '@/i18n'
import {
  formatMatchAnalysisScore,
  formatMatchAnalysisText,
  formatMatchAnalysisTitle,
} from '../../formatMatchAnalysisText'
import { jobTitleIconSize } from '../titleIconSize'

export const MatchAnalysisIndicator: FC<{ matchAnalysis: JobAdMatchAnalysis | null }> = ({ matchAnalysis }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const [open, setOpen] = useState(false)

  if (matchAnalysis === null) {
    return null
  }

  const scoreLabel = formatMatchAnalysisScore(matchAnalysis, labels)

  return (
    <>
      <Tooltip title={matchAnalysis.summary}>
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
          <AiSparklesIcon size={jobTitleIconSize} strokeWidth={designTokens.icon.strokeWidth} glow='soft' aria-hidden />
          <span style={{ color: 'var(--mui-palette-text-secondary)', fontSize: 'inherit' }}>{scoreLabel}</span>
        </IconButton>
      </Tooltip>
      <CvPreviewDialog
        open={open}
        onClose={() => setOpen(false)}
        title={formatMatchAnalysisTitle(matchAnalysis, labels)}
        text={formatMatchAnalysisText(matchAnalysis, labels)}
      />
    </>
  )
}
