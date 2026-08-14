import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import { LoaderIcon } from '@repo/assets'
import { fetchJobAdCvMatch } from '@repo/feed-client'
import { type JobAdMatchAnalysis } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { type FC, useEffect, useState } from 'react'
import { useTranslations } from '@/i18n'
import {
  formatMatchAnalysisStaleNotice,
  formatMatchAnalysisText,
  formatMatchAnalysisTitle,
} from './formatMatchAnalysisText'

type JobAdCvMatchDialogProps = {
  open: boolean
  onClose: () => void
  adId: string
  isCurrentCVUsed: boolean
}

export const JobAdCvMatchDialog: FC<JobAdCvMatchDialogProps> = ({ open, onClose, adId, isCurrentCVUsed }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const [loading, setLoading] = useState(false)
  const [matchAnalysis, setMatchAnalysis] = useState<JobAdMatchAnalysis | null>(null)

  useEffect(() => {
    if (!open) {
      setMatchAnalysis(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    void fetchJobAdCvMatch(adId)
      .then(analysis => {
        if (!cancelled) {
          setMatchAnalysis(analysis)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMatchAnalysis(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [adId, open])

  const title = matchAnalysis !== null ? formatMatchAnalysisTitle(matchAnalysis, labels) : labels.matchAnalysisTitle
  const notice = matchAnalysis !== null ? formatMatchAnalysisStaleNotice(isCurrentCVUsed, labels) : null
  const text = matchAnalysis !== null ? formatMatchAnalysisText(matchAnalysis, labels) : null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <LoaderIcon
            spinning
            size={designTokens.icon.sizeMd}
            strokeWidth={designTokens.icon.strokeWidth}
            aria-hidden
          />
        ) : (
          <>
            {notice ? (
              <Typography component='strong' sx={{ display: 'block', mb: 2, fontWeight: 500, color: 'accentRed.main' }}>
                {notice}
              </Typography>
            ) : null}
            {text !== null ? (
              <Typography component='pre' sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', m: 0 }}>
                {text}
              </Typography>
            ) : null}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
