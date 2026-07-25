import { act, renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '@/i18n'
import { jobAd, matchAnalysis } from '@/pages/JobMarket/test/fixtures/jobAd'
import { formatMatchAnalysisText } from '@/pages/JobMarket/cards/JobAds/shared-components/formatMatchAnalysisText'
import { useCvMatchAnalysis } from './useCvMatchAnalysis'

const expectedDialogText = formatMatchAnalysisText(matchAnalysis({ analyzedAt: '2026-01-01T00:00:00.000Z' }), {
  matchAnalysisSummarySection: 'Podsumowanie',
  matchAnalysisStrengthsSection: 'Mocne strony',
  matchAnalysisGapsSection: 'Luki',
  matchAnalysisObservationsSection: 'Obserwacje',
  matchAnalysisConclusionSection: 'Wnioski',
})

function TestWrapper({ children }: { children: ReactNode }) {
  return <I18nProvider initialLocale='pl'>{children}</I18nProvider>
}

function renderUseCvMatchAnalysis(props: Parameters<typeof useCvMatchAnalysis>[0]) {
  return renderHook(({ ad }) => useCvMatchAnalysis({ ...props, ad }), {
    initialProps: { ad: props.ad },
    wrapper: TestWrapper,
  })
}

describe('useCvMatchAnalysis', () => {
  it('opens dialog when ad receives a new match analysis while analyzing', async () => {
    const onAnalyze = vi.fn()
    const initialAd = jobAd({ id: '1', title: 'Role' })

    const { result, rerender } = renderUseCvMatchAnalysis({
      ad: initialAd,
      canAnalyze: true,
      onAnalyze,
    })

    act(() => {
      result.current.requestAnalysis()
    })

    expect(onAnalyze).toHaveBeenCalledWith('1')
    expect(result.current.analyzing).toBe(true)

    rerender({
      ad: jobAd({
        id: '1',
        title: 'Role',
        matchAnalysis: matchAnalysis({
          analyzedAt: '2026-01-02T00:00:00.000Z',
          summary: 'Dobre dopasowanie.',
        }),
      }),
    })

    await waitFor(() => {
      expect(result.current.dialogOpen).toBe(true)
    })
    expect(result.current.dialogText).toBe(expectedDialogText)
    expect(result.current.dialogTitle).toBe('Analiza dopasowania CV — 4/5')
    expect(result.current.analyzing).toBe(false)
  })

  it('ignores match analysis until analyzedAt changes on re-analysis', async () => {
    const onAnalyze = vi.fn()
    const analyzedAt = '2026-01-01T00:00:00.000Z'
    const initialAd = jobAd({
      id: '2',
      title: 'Role',
      matchAnalysis: matchAnalysis({ analyzedAt, summary: 'Stara analiza.' }),
    })

    const { result, rerender } = renderUseCvMatchAnalysis({
      ad: initialAd,
      canAnalyze: true,
      onAnalyze,
    })

    act(() => {
      result.current.requestAnalysis()
    })

    rerender({
      ad: jobAd({
        id: '2',
        title: 'Role',
        matchAnalysis: matchAnalysis({ analyzedAt, summary: 'Stara analiza.' }),
      }),
    })

    expect(result.current.dialogOpen).toBe(false)
    expect(result.current.analyzing).toBe(true)

    rerender({
      ad: jobAd({
        id: '2',
        title: 'Role',
        matchAnalysis: matchAnalysis({
          analyzedAt: '2026-01-02T00:00:00.000Z',
          summary: 'Nowa analiza.',
        }),
      }),
    })

    await waitFor(() => {
      expect(result.current.dialogOpen).toBe(true)
    })
    expect(result.current.dialogText).toBe(
      formatMatchAnalysisText(
        matchAnalysis({
          analyzedAt: '2026-01-02T00:00:00.000Z',
          summary: 'Nowa analiza.',
        }),
        {
          matchAnalysisSummarySection: 'Podsumowanie',
          matchAnalysisStrengthsSection: 'Mocne strony',
          matchAnalysisGapsSection: 'Luki',
          matchAnalysisObservationsSection: 'Obserwacje',
          matchAnalysisConclusionSection: 'Wnioski',
        },
      ),
    )
    expect(result.current.dialogTitle).toBe('Analiza dopasowania CV — 4/5')
  })

  it('resets state when resetWhen changes', () => {
    const onAnalyze = vi.fn()
    const initialAd = jobAd({ id: '3', title: 'Role' })

    const { result, rerender } = renderHook(
      ({ ad, resetWhen }) =>
        useCvMatchAnalysis({
          ad,
          canAnalyze: true,
          onAnalyze,
          resetWhen,
        }),
      {
        initialProps: { ad: initialAd, resetWhen: 'applied' },
        wrapper: TestWrapper,
      },
    )

    act(() => {
      result.current.requestAnalysis()
    })

    expect(result.current.analyzing).toBe(true)

    rerender({ ad: initialAd, resetWhen: 'interview' })

    expect(result.current.analyzing).toBe(false)
    expect(result.current.dialogOpen).toBe(false)
  })
})
