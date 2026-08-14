import { act, renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '@/i18n'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { useCvMatchAnalysis } from './useCvMatchAnalysis'

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
  it('opens dialog after analyze command resolves', async () => {
    const onAnalyze = vi.fn().mockResolvedValue(undefined)
    const initialAd = jobAd({ id: '1', title: 'Role' })

    const { result } = renderUseCvMatchAnalysis({
      ad: initialAd,
      canAnalyze: true,
      onAnalyze,
    })

    act(() => {
      result.current.requestAnalysis()
    })

    expect(onAnalyze).toHaveBeenCalledWith('1')
    expect(result.current.analyzing).toBe(true)

    await waitFor(() => {
      expect(result.current.dialogOpen).toBe(true)
    })
    expect(result.current.analyzing).toBe(false)
  })

  it('does not open dialog when analyze command rejects', async () => {
    const onAnalyze = vi.fn().mockRejectedValue(new Error('failed'))
    const initialAd = jobAd({ id: '2', title: 'Role' })

    const { result } = renderUseCvMatchAnalysis({
      ad: initialAd,
      canAnalyze: true,
      onAnalyze,
    })

    act(() => {
      result.current.requestAnalysis()
    })

    await waitFor(() => {
      expect(result.current.analyzing).toBe(false)
    })
    expect(result.current.dialogOpen).toBe(false)
  })

  it('resets state when resetWhen changes', () => {
    const onAnalyze = vi.fn().mockResolvedValue(undefined)
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
