import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { useCvMatchAnalysis } from './useCvMatchAnalysis'

describe('useCvMatchAnalysis', () => {
  it('opens dialog when ad receives a new match analysis while analyzing', async () => {
    const onAnalyze = vi.fn()
    const initialAd = jobAd({ id: '1', title: 'Role' })

    const { result, rerender } = renderHook(
      ({ ad }) =>
        useCvMatchAnalysis({
          ad,
          canAnalyze: true,
          onAnalyze,
        }),
      { initialProps: { ad: initialAd } },
    )

    act(() => {
      result.current.requestAnalysis()
    })

    expect(onAnalyze).toHaveBeenCalledWith('1')
    expect(result.current.analyzing).toBe(true)

    rerender({
      ad: jobAd({
        id: '1',
        title: 'Role',
        matchAnalysis: {
          analyzedAt: '2026-01-02T00:00:00.000Z',
          summary: 'Dobre dopasowanie.',
        },
      }),
    })

    await waitFor(() => {
      expect(result.current.dialogOpen).toBe(true)
    })
    expect(result.current.dialogSummary).toBe('Dobre dopasowanie.')
    expect(result.current.analyzing).toBe(false)
  })

  it('ignores match analysis until analyzedAt changes on re-analysis', async () => {
    const onAnalyze = vi.fn()
    const analyzedAt = '2026-01-01T00:00:00.000Z'
    const initialAd = jobAd({
      id: '2',
      title: 'Role',
      matchAnalysis: { analyzedAt, summary: 'Stara analiza.' },
    })

    const { result, rerender } = renderHook(
      ({ ad }) =>
        useCvMatchAnalysis({
          ad,
          canAnalyze: true,
          onAnalyze,
        }),
      { initialProps: { ad: initialAd } },
    )

    act(() => {
      result.current.requestAnalysis()
    })

    rerender({
      ad: jobAd({
        id: '2',
        title: 'Role',
        matchAnalysis: { analyzedAt, summary: 'Stara analiza.' },
      }),
    })

    expect(result.current.dialogOpen).toBe(false)
    expect(result.current.analyzing).toBe(true)

    rerender({
      ad: jobAd({
        id: '2',
        title: 'Role',
        matchAnalysis: {
          analyzedAt: '2026-01-02T00:00:00.000Z',
          summary: 'Nowa analiza.',
        },
      }),
    })

    await waitFor(() => {
      expect(result.current.dialogOpen).toBe(true)
    })
    expect(result.current.dialogSummary).toBe('Nowa analiza.')
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
      { initialProps: { ad: initialAd, resetWhen: 'applied' } },
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
