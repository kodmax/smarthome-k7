import { describe, expect, it } from 'vitest'
import { type MarketInfo } from '@repo/types'
import { getEffectiveMarketStatus } from './getEffectiveMarketStatus'

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

describe('getEffectiveMarketStatus', () => {
  it('returns Closed before pre-market and after after-hours', () => {
    expect(getEffectiveMarketStatus(marketInfo, marketInfo.preMarketOpeningTime - 60_000)).toBe('Closed')
    expect(getEffectiveMarketStatus(marketInfo, marketInfo.afterHoursMarketClosingTime + 60_000)).toBe('Closed')
  })

  it('returns Pre-Market between pre-market and regular session', () => {
    expect(getEffectiveMarketStatus(marketInfo, marketInfo.marketOpeningTime - 60_000)).toBe('Pre-Market')
  })

  it('returns Open during regular session', () => {
    expect(getEffectiveMarketStatus(marketInfo, marketInfo.marketOpeningTime + 60_000)).toBe('Open')
  })

  it('returns After-Hours between regular close and after-hours close', () => {
    expect(getEffectiveMarketStatus(marketInfo, marketInfo.marketClosingTime + 60_000)).toBe('After-Hours')
  })

  it('returns correct status at exact session boundaries', () => {
    expect(getEffectiveMarketStatus(marketInfo, marketInfo.preMarketOpeningTime - 1)).toBe('Closed')
    expect(getEffectiveMarketStatus(marketInfo, marketInfo.preMarketOpeningTime)).toBe('Pre-Market')
    expect(getEffectiveMarketStatus(marketInfo, marketInfo.marketOpeningTime)).toBe('Open')
    expect(getEffectiveMarketStatus(marketInfo, marketInfo.marketClosingTime)).toBe('After-Hours')
    expect(getEffectiveMarketStatus(marketInfo, marketInfo.afterHoursMarketClosingTime)).toBe('Closed')
  })
})
