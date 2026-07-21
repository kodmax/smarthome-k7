import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { useSortedTickers } from './useSortedTickers'

describe('HighUpsideCard useSortedTickers', () => {
  it('returns undefined when feed is undefined', () => {
    const { result } = renderHook(() => useSortedTickers(undefined))

    expect(result.current).toBeUndefined()
  })

  it('filters out tickers without forward EPS', () => {
    const { result } = renderHook(() =>
      useSortedTickers(
        stockMarketFeed(
          ticker({ symbol: 'AAA', price: { eg: 50 } }),
          ticker({ symbol: 'BBB', price: { eg: 50 }, statistics: { forwardEPS: null } }),
        ),
      ),
    )

    expect(result.current?.map(item => item.symbol)).toEqual(['AAA'])
  })

  it('filters out tickers without EG', () => {
    const { result } = renderHook(() =>
      useSortedTickers(
        stockMarketFeed(ticker({ symbol: 'AAA', price: { eg: 50 } }), ticker({ symbol: 'BBB', price: { eg: null } })),
      ),
    )

    expect(result.current?.map(item => item.symbol)).toEqual(['AAA'])
  })

  it('filters out tickers with EG at most 40', () => {
    const { result } = renderHook(() =>
      useSortedTickers(
        stockMarketFeed(
          ticker({ symbol: 'HIGH', price: { eg: 50 } }),
          ticker({ symbol: 'LOW', price: { eg: 40 } }),
          ticker({ symbol: 'BELOW', price: { eg: 30 } }),
        ),
      ),
    )

    expect(result.current?.map(item => item.symbol)).toEqual(['HIGH'])
  })

  it('sorts tickers by EG descending', () => {
    const { result } = renderHook(() =>
      useSortedTickers(
        stockMarketFeed(
          ticker({ symbol: 'LOW', price: { eg: 45 } }),
          ticker({ symbol: 'HIGH', price: { eg: 60 } }),
          ticker({ symbol: 'MID', price: { eg: 50 } }),
        ),
      ),
    )

    expect(result.current?.map(item => item.symbol)).toEqual(['HIGH', 'MID', 'LOW'])
  })
})
