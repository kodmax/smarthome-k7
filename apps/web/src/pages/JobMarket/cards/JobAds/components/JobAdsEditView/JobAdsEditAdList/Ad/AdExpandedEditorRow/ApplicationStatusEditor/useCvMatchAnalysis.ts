import { type JobAdsFeedItem } from '@repo/types'
import { useCallback, useEffect, useState } from 'react'
import {
  formatMatchAnalysisStaleNotice,
  formatMatchAnalysisText,
  formatMatchAnalysisTitle,
} from '@/pages/JobMarket/cards/JobAds/shared-components/formatMatchAnalysisText'
import { useTranslations } from '@/i18n'

const MATCH_ANALYSIS_TIMEOUT_MS = 120_000

type UseCvMatchAnalysisOptions = {
  ad: Pick<JobAdsFeedItem, 'content' | 'matchAnalysis' | 'meta'>
  canAnalyze: boolean
  onAnalyze: (adId: string) => void
  resetWhen?: unknown
}

export function useCvMatchAnalysis({ ad, canAnalyze, onAnalyze, resetWhen }: UseCvMatchAnalysisOptions) {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const [analyzing, setAnalyzing] = useState(false)
  const [pendingAnalysisAt, setPendingAnalysisAt] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState<string | null>(null)
  const [dialogText, setDialogText] = useState<string | null>(null)
  const [dialogNotice, setDialogNotice] = useState<string | null>(null)

  useEffect(() => {
    setAnalyzing(false)
    setPendingAnalysisAt(null)
    setDialogOpen(false)
    setDialogTitle(null)
    setDialogText(null)
    setDialogNotice(null)
  }, [ad.content.id, resetWhen])

  useEffect(() => {
    if (!analyzing) {
      return
    }

    const matchAnalysis = ad.matchAnalysis
    if (matchAnalysis === null) {
      return
    }

    const isUpdated = pendingAnalysisAt === null ? true : matchAnalysis.analyzedAt !== pendingAnalysisAt

    if (!isUpdated) {
      return
    }

    setDialogTitle(formatMatchAnalysisTitle(matchAnalysis, labels))
    setDialogNotice(formatMatchAnalysisStaleNotice(ad.meta.isCurrentCVUsed, labels))
    setDialogText(formatMatchAnalysisText(matchAnalysis, labels))
    setDialogOpen(true)
    setAnalyzing(false)
    setPendingAnalysisAt(null)
  }, [ad, analyzing, labels, pendingAnalysisAt])

  useEffect(() => {
    if (!analyzing) {
      return
    }

    const timeout = setTimeout(() => {
      setAnalyzing(false)
      setPendingAnalysisAt(null)
    }, MATCH_ANALYSIS_TIMEOUT_MS)

    return () => clearTimeout(timeout)
  }, [analyzing])

  const requestAnalysis = useCallback(() => {
    if (!canAnalyze || analyzing) {
      return
    }

    setPendingAnalysisAt(ad.matchAnalysis?.analyzedAt ?? null)
    setAnalyzing(true)
    onAnalyze(ad.content.id)
  }, [ad.content.id, ad.matchAnalysis?.analyzedAt, analyzing, canAnalyze, onAnalyze])

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
  }, [])

  return {
    analyzing,
    dialogOpen,
    dialogTitle,
    dialogText,
    dialogNotice,
    closeDialog,
    requestAnalysis,
  }
}
