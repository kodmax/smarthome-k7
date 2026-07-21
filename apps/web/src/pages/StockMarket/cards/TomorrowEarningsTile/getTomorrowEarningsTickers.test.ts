import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { getTomorrowEarningsTickers } from './getTomorrowEarningsTickers'

describe('getTomorrowEarningsTickers', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-28T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('includes tickers with earnings tomorrow', () => {
    const result = getTomorrowEarningsTickers(
      stockMarketFeed(
        ticker({ symbol: 'TOMORROW', earningsDate: { confirmed: '2026-06-29' } }),
        ticker({ symbol: 'LATER', earningsDate: { confirmed: '2026-07-15' } }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['TOMORROW'])
  })

  it('excludes tickers without earnings date', () => {
    const result = getTomorrowEarningsTickers(stockMarketFeed(ticker({ symbol: 'NO_DATE', earningsDate: {} })).tickers)

    expect(result).toEqual([])
  })

  it('excludes tickers with earnings today or later than tomorrow', () => {
    const result = getTomorrowEarningsTickers(
      stockMarketFeed(
        ticker({ symbol: 'TODAY', earningsDate: { confirmed: '2026-06-28' } }),
        ticker({ symbol: 'DAY_AFTER', earningsDate: { confirmed: '2026-06-30' } }),
      ).tickers,
    )

    expect(result).toEqual([])
  })

  it('uses estimated date when confirmed date is unavailable', () => {
    const result = getTomorrowEarningsTickers(
      stockMarketFeed(ticker({ symbol: 'EST', earningsDate: { estimated: '2026-06-29' } })).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['EST'])
  })
})
