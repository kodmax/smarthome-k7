import { type JobAdsFeedItem } from '@repo/types'
import { useCallback, useEffect, useReducer } from 'react'
import {
  formatMatchAnalysisStaleNotice,
  formatMatchAnalysisText,
  formatMatchAnalysisTitle,
} from '@/pages/JobMarket/cards/JobAds/shared-components/formatMatchAnalysisText'
import { useTranslations } from '@/i18n'
import { cvMatchAnalysisReducer, initialCvMatchAnalysisState } from './cvMatchAnalysisReducer'

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
  const [state, dispatch] = useReducer(cvMatchAnalysisReducer, initialCvMatchAnalysisState)
  const { analyzing, pendingAnalysisAt, dialogOpen, dialogTitle, dialogText, dialogNotice } = state

  useEffect(() => {
    dispatch({ type: 'reset' })
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

    dispatch({
      type: 'show-result',
      title: formatMatchAnalysisTitle(matchAnalysis, labels),
      notice: formatMatchAnalysisStaleNotice(ad.meta.isCurrentCVUsed, labels),
      text: formatMatchAnalysisText(matchAnalysis, labels),
    })
  }, [ad, analyzing, labels, pendingAnalysisAt])

  useEffect(() => {
    if (!analyzing) {
      return
    }

    const timeout = setTimeout(() => {
      dispatch({ type: 'timeout' })
    }, MATCH_ANALYSIS_TIMEOUT_MS)

    return () => clearTimeout(timeout)
  }, [analyzing])

  const requestAnalysis = useCallback(() => {
    if (!canAnalyze || analyzing) {
      return
    }

    dispatch({ type: 'start-analysis', pendingAnalysisAt: ad.matchAnalysis?.analyzedAt ?? null })
    onAnalyze(ad.content.id)
  }, [ad.content.id, ad.matchAnalysis?.analyzedAt, analyzing, canAnalyze, onAnalyze])

  const closeDialog = useCallback(() => {
    dispatch({ type: 'close-dialog' })
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
