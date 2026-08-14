import { type JobAdsFeedItem } from '@repo/types'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { cvMatchAnalysisReducer, initialCvMatchAnalysisState } from './cvMatchAnalysisReducer'

const MATCH_ANALYSIS_TIMEOUT_MS = 120_000

type UseCvMatchAnalysisOptions = {
  ad: Pick<JobAdsFeedItem, 'content' | 'meta'>
  canAnalyze: boolean
  onAnalyze: (adId: string) => Promise<void>
  resetWhen?: unknown
}

export function useCvMatchAnalysis({ ad, canAnalyze, onAnalyze, resetWhen }: UseCvMatchAnalysisOptions) {
  const [state, dispatch] = useReducer(cvMatchAnalysisReducer, initialCvMatchAnalysisState)
  const { analyzing, dialogOpen } = state
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    dispatch({ type: 'reset' })
  }, [ad.content.id, resetWhen])

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

    dispatch({ type: 'start-analysis' })
    void onAnalyze(ad.content.id)
      .then(() => {
        if (!isMountedRef.current) {
          return
        }

        dispatch({ type: 'open-dialog' })
      })
      .catch(() => {
        if (!isMountedRef.current) {
          return
        }

        dispatch({ type: 'analysis-failed' })
      })
  }, [ad.content.id, analyzing, canAnalyze, onAnalyze])

  const closeDialog = useCallback(() => {
    dispatch({ type: 'close-dialog' })
  }, [])

  return {
    analyzing,
    dialogOpen,
    closeDialog,
    requestAnalysis,
  }
}
