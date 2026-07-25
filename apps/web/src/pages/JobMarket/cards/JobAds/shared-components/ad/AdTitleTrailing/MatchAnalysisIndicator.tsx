import { IconButton } from '@mui/material'
import { AiSparklesIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type JobAdMatchAnalysis } from '@repo/types'
import { type FC, useState } from 'react'
import { CvPreviewDialog } from '@/pages/JobMarket/cards/Cv/CvPreviewDialog'
import { useTranslations } from '@/i18n'
import { jobTitleIconSize } from '../titleIconSize'

export const MatchAnalysisIndicator: FC<{ matchAnalysis: JobAdMatchAnalysis | null }> = ({ matchAnalysis }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const [open, setOpen] = useState(false)

  if (matchAnalysis === null) {
    return null
  }

  return (
    <>
      <IconButton
        aria-label={labels.viewMatchAnalysis}
        onClick={() => setOpen(true)}
        size='small'
        sx={{
          p: 0,
          verticalAlign: 'middle',
          display: 'inline-flex',
        }}
      >
        <AiSparklesIcon size={jobTitleIconSize} strokeWidth={designTokens.icon.strokeWidth} glow='soft' aria-hidden />
      </IconButton>
      <CvPreviewDialog
        open={open}
        onClose={() => setOpen(false)}
        title={labels.matchAnalysisTitle}
        text={matchAnalysis.summary}
      />
    </>
  )
}
