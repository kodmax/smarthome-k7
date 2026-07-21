import { describe, expect, it } from 'vitest'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { sortHighUpsideTickers } from './sortHighUpsideTickers'

describe('sortHighUpsideTickers', () => {
  it('filters out tickers without forward EPS', () => {
    const result = sortHighUpsideTickers(
      stockMarketFeed(
        ticker({ symbol: 'AAA', price: { eg: 50 } }),
        ticker({ symbol: 'BBB', price: { eg: 50 }, statistics: { forwardEPS: null } }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['AAA'])
  })

  it('filters out tickers without EG', () => {
    const result = sortHighUpsideTickers(
      stockMarketFeed(ticker({ symbol: 'AAA', price: { eg: 50 } }), ticker({ symbol: 'BBB', price: { eg: null } }))
        .tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['AAA'])
  })

  it('filters out tickers with EG at most 40', () => {
    const result = sortHighUpsideTickers(
      stockMarketFeed(
        ticker({ symbol: 'HIGH', price: { eg: 50 } }),
        ticker({ symbol: 'LOW', price: { eg: 40 } }),
        ticker({ symbol: 'BELOW', price: { eg: 30 } }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['HIGH'])
  })

  it('sorts tickers by EG descending', () => {
    const result = sortHighUpsideTickers(
      stockMarketFeed(
        ticker({ symbol: 'LOW', price: { eg: 45 } }),
        ticker({ symbol: 'HIGH', price: { eg: 60 } }),
        ticker({ symbol: 'MID', price: { eg: 50 } }),
      ).tickers,
    )

    expect(result.map(item => item.symbol)).toEqual(['HIGH', 'MID', 'LOW'])
  })
})
