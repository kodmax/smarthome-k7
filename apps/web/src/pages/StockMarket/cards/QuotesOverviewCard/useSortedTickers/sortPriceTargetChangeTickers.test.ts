import { describe, expect, it } from 'vitest'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { sortPriceTargetChangeTickers } from './sortPriceTargetChangeTickers'

describe('sortPriceTargetChangeTickers', () => {
  it('excludes tickers without 30-day price target change', () => {
    const result = sortPriceTargetChangeTickers(
      stockMarketFeed(
        ticker({
          symbol: 'WITH_CHANGE',
          quoteSummary: { priceTargetChange: { last30days: 0.05 } },
        }),
        ticker({
          symbol: 'NO_CHANGE',
          quoteSummary: { priceTargetChange: { last30days: null } },
        }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['WITH_CHANGE'])
  })

  it('excludes tickers with change below 3 percent in absolute value', () => {
    const result = sortPriceTargetChangeTickers(
      stockMarketFeed(
        ticker({
          symbol: 'OK',
          quoteSummary: { priceTargetChange: { last30days: 0.03 } },
        }),
        ticker({
          symbol: 'SMALL',
          quoteSummary: { priceTargetChange: { last30days: 0.029 } },
        }),
        ticker({
          symbol: 'SMALL_DOWN',
          quoteSummary: { priceTargetChange: { last30days: -0.02 } },
        }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['OK'])
  })

  it('includes tickers with at least 3 percent downward change', () => {
    const result = sortPriceTargetChangeTickers(
      stockMarketFeed(
        ticker({
          symbol: 'DOWN',
          quoteSummary: { priceTargetChange: { last30days: -0.05 } },
        }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['DOWN'])
  })

  it('sorts tickers by 30-day price target change descending', () => {
    const result = sortPriceTargetChangeTickers(
      stockMarketFeed(
        ticker({
          symbol: 'LOW',
          quoteSummary: { priceTargetChange: { last30days: 0.04 } },
        }),
        ticker({
          symbol: 'HIGH',
          quoteSummary: { priceTargetChange: { last30days: 0.1 } },
        }),
        ticker({
          symbol: 'NEGATIVE',
          quoteSummary: { priceTargetChange: { last30days: -0.03 } },
        }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['HIGH', 'LOW', 'NEGATIVE'])
  })
})
