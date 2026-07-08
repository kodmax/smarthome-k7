import { describe, expect, it } from 'vitest'
import { type MarketInfo } from '@repo/types'
import { getEffectiveMarketStatus } from './getEffectiveMarketStatus'
import { getMarketCountdownRemaining, getMarketCountdownTarget } from './getMarketCountdownTarget'
import { getNextSessionOpeningTime } from './getNextSessionOpeningTime'

const marketInfo: MarketInfo = {
  country: 'U.S.',
  status: 'Closed',
  indicator: 'Market Closed',
  uiIndicator: 'Market Closed',
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

describe('getMarketCountdownTarget', () => {
  it('targets market opening before regular session starts', () => {
    expect(getMarketCountdownTarget(marketInfo, 1783430000000)).toEqual({
      target: 1783431000000,
      prefix: 'Otwarcie za',
    })
  })

  it('targets market closing during regular session even when feed status is stale', () => {
    expect(getEffectiveMarketStatus({ ...marketInfo, status: 'Closed' }, 1783440000000)).toBe('Open')
    expect(getMarketCountdownTarget(marketInfo, 1783440000000)).toEqual({
      target: 1783454400000,
      prefix: 'Zamknięcie za',
    })
  })

  it('treats market as open one minute after opening when feed still says pre-market', () => {
    const oneMinuteAfterOpen = marketInfo.marketOpeningTime + 60_000

    expect(getEffectiveMarketStatus({ ...marketInfo, status: 'Pre-Market' }, oneMinuteAfterOpen)).toBe('Open')
    expect(getMarketCountdownTarget(marketInfo, oneMinuteAfterOpen)).toEqual({
      target: marketInfo.marketClosingTime,
      prefix: 'Zamknięcie za',
    })
  })

  it('treats market as after-hours one minute after close when feed still says open', () => {
    const oneMinuteAfterClose = marketInfo.marketClosingTime + 60_000

    expect(getEffectiveMarketStatus({ ...marketInfo, status: 'Open' }, oneMinuteAfterClose)).toBe('After-Hours')
    expect(getMarketCountdownTarget(marketInfo, oneMinuteAfterClose)).toEqual({
      target: getNextSessionOpeningTime(marketInfo),
      prefix: 'Otwarcie za',
    })
  })

  it('shows zero remaining at the exact regular close', () => {
    expect(getMarketCountdownTarget(marketInfo, 1783454400000)).toEqual({
      target: 1783454400000,
      prefix: 'Zamknięcie za',
    })
    expect(getMarketCountdownRemaining(marketInfo, 1783454400000)).toBe(0)
  })

  it('counts down to the next opening after regular close instead of after-hours', () => {
    const nextOpening = getNextSessionOpeningTime(marketInfo)

    expect(getMarketCountdownTarget(marketInfo, 1783454400001)).toEqual({
      target: nextOpening,
      prefix: 'Otwarcie za',
    })
    expect(getEffectiveMarketStatus({ ...marketInfo, status: 'Open' }, 1783454400001)).toBe('After-Hours')
  })

  it('treats market as closed after after-hours ends even when feed still says closed overnight', () => {
    const oneMinuteAfterAfterHoursClose = marketInfo.afterHoursMarketClosingTime + 60_000

    expect(getEffectiveMarketStatus({ ...marketInfo, status: 'Closed' }, oneMinuteAfterAfterHoursClose)).toBe('Closed')
  })

  it('never shows negative countdown values when feed timestamps are in the past', () => {
    expect(getMarketCountdownRemaining(marketInfo, 1783600000000)).toBe(0)
    expect(getMarketCountdownTarget(marketInfo, 1783600000000)).toEqual({
      target: getNextSessionOpeningTime(marketInfo),
      prefix: 'Otwarcie za',
    })
  })
})
