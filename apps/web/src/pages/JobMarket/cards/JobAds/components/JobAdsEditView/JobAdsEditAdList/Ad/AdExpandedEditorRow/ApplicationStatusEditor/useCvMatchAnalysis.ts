import { type JobAdWithMeta } from '@repo/types'
import { useCallback, useEffect, useState } from 'react'

const MATCH_ANALYSIS_TIMEOUT_MS = 120_000

type UseCvMatchAnalysisOptions = {
  ad: Pick<JobAdWithMeta, 'id' | 'matchAnalysis'>
  canAnalyze: boolean
  onAnalyze: (adId: string) => void
  resetWhen?: unknown
}

export function useCvMatchAnalysis({ ad, canAnalyze, onAnalyze, resetWhen }: UseCvMatchAnalysisOptions) {
  const [analyzing, setAnalyzing] = useState(false)
  const [pendingAnalysisAt, setPendingAnalysisAt] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogSummary, setDialogSummary] = useState<string | null>(null)

  useEffect(() => {
    setAnalyzing(false)
    setPendingAnalysisAt(null)
    setDialogOpen(false)
    setDialogSummary(null)
  }, [ad.id, resetWhen])

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

    setDialogSummary(matchAnalysis.summary)
    setDialogOpen(true)
    setAnalyzing(false)
    setPendingAnalysisAt(null)
  }, [ad, analyzing, pendingAnalysisAt])

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
    onAnalyze(ad.id)
  }, [ad.id, ad.matchAnalysis?.analyzedAt, analyzing, canAnalyze, onAnalyze])

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
  }, [])

  return {
    analyzing,
    dialogOpen,
    dialogSummary,
    closeDialog,
    requestAnalysis,
  }
}
