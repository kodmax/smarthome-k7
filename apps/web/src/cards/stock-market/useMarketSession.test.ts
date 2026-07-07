import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type MarketInfo } from '@repo/types'
import { getNextSessionOpeningTime } from './helpers/getNextSessionOpeningTime'
import { formatMarketDuration } from './helpers/formatMarketDuration'
import { useMarketSession } from './useMarketSession'

const marketInfo: MarketInfo = {
  country: 'U.S.',
  status: 'Open',
  indicator: 'Market Open',
  uiIndicator: 'Market Open',
  countdown: '',
  marketCountdown: '',
  isBusinessDay: true,
  previousTradeDate: 1783310400000,
  nextTradeDate: 1783483200000,
  preMarketOpeningTime: 1783411200000,
  preMarketClosingTime: 1783431000000,
  marketOpeningTime: 1783431000000,
  marketClosingTime: 1783454400000,
  afterHoursMarketOpeningTime: 1783454400000,
  afterHoursMarketClosingTime: 1783468800000,
}

describe('useMarketSession', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(1783431000000)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns undefined when market info is unavailable', () => {
    const { result } = renderHook(() => useMarketSession(undefined))

    expect(result.current).toBeUndefined()
  })

  it('counts down to market close when market is open', () => {
    const { result } = renderHook(() => useMarketSession(marketInfo))

    expect(result.current).toEqual({
      status: 'Open',
      countdown: 'Zamknięcie za 6g 30m',
    })
  })

  it('derives closed status before opening even when feed status is stale', () => {
    vi.setSystemTime(1783430000000)

    const { result } = renderHook(() => useMarketSession({ ...marketInfo, status: 'Open' }))

    expect(result.current).toEqual({
      status: 'Pre-Market',
      countdown: 'Otwarcie za 16m',
    })
  })

  it('switches to after-hours and counts down to the next opening after regular close', () => {
    vi.setSystemTime(1783454400000)

    const { result } = renderHook(() => useMarketSession(marketInfo))

    expect(result.current?.status).toBe('After-Hours')
    expect(result.current?.countdown).toBe('Zamknięcie za 0s')

    act(() => {
      vi.setSystemTime(1783454400001)
      vi.advanceTimersByTime(100)
    })

    const nextOpening = getNextSessionOpeningTime(marketInfo)

    expect(result.current?.status).toBe('After-Hours')
    expect(result.current?.countdown).toBe(`Otwarcie za ${formatMarketDuration(nextOpening - 1783454400001)}`)
  })
})
