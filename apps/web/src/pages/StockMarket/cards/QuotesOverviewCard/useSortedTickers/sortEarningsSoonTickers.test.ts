import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { sortEarningsSoonTickers } from './sortEarningsSoonTickers'

describe('sortEarningsSoonTickers', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-28T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('excludes tickers without earnings date', () => {
    const result = sortEarningsSoonTickers(
      stockMarketFeed(
        ticker({ symbol: 'WITH_DATE', earningsDate: { confirmed: '2026-07-15' } }),
        ticker({ symbol: 'NO_DATE', earningsDate: {} }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['WITH_DATE'])
  })

  it('excludes tickers with earnings more than 30 days away', () => {
    const result = sortEarningsSoonTickers(
      stockMarketFeed(
        ticker({ symbol: 'SOON', earningsDate: { confirmed: '2026-07-15' } }),
        ticker({ symbol: 'LATER', earningsDate: { confirmed: '2026-08-15' } }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['SOON'])
  })

  it('excludes tickers with earnings date in the past', () => {
    const result = sortEarningsSoonTickers(
      stockMarketFeed(
        ticker({ symbol: 'SOON', earningsDate: { confirmed: '2026-07-15' } }),
        ticker({ symbol: 'PAST', earningsDate: { confirmed: '2026-06-01' } }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['SOON'])
  })

  it('uses estimated date when confirmed date is unavailable', () => {
    const result = sortEarningsSoonTickers(
      stockMarketFeed(ticker({ symbol: 'EST', earningsDate: { estimated: '2026-07-10' } })).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['EST'])
  })

  it('sorts tickers by ascending days to earnings', () => {
    const result = sortEarningsSoonTickers(
      stockMarketFeed(
        ticker({ symbol: 'LATER', earningsDate: { confirmed: '2026-07-20' } }),
        ticker({ symbol: 'SOONER', earningsDate: { confirmed: '2026-07-05' } }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['SOONER', 'LATER'])
  })
})
