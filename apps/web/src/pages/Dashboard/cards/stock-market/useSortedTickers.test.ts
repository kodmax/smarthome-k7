import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { useSortedTickers } from './useSortedTickers'

describe('useSortedTickers', () => {
  it('returns undefined when feed is undefined', () => {
    const { result } = renderHook(() => useSortedTickers(undefined))

    expect(result.current).toBeUndefined()
  })

  it('filters out tickers without forward EPS', () => {
    const feed = stockMarketFeed(
      ticker({ symbol: 'AAA' }),
      ticker({ symbol: 'BBB', statistics: { trailingEPS: 5, forwardEPS: null } }),
    )

    const { result } = renderHook(() => useSortedTickers(feed))

    expect(result.current?.map(item => item.symbol)).toEqual(['AAA'])
  })

  it('sorts tickers by EG descending', () => {
    const feed = stockMarketFeed(
      ticker({ symbol: 'LOW', price: { eg: 5 } }),
      ticker({ symbol: 'HIGH', price: { eg: 20 } }),
      ticker({ symbol: 'MID', price: { eg: 12 } }),
    )

    const { result } = renderHook(() => useSortedTickers(feed))

    expect(result.current?.map(item => item.symbol)).toEqual(['HIGH', 'MID', 'LOW'])
  })

  it('treats missing EG as zero when sorting', () => {
    const feed = stockMarketFeed(
      ticker({ symbol: 'WITH_EG', price: { eg: 3 } }),
      ticker({ symbol: 'NO_EG', price: { eg: null } }),
    )

    const { result } = renderHook(() => useSortedTickers(feed))

    expect(result.current?.map(item => item.symbol)).toEqual(['WITH_EG', 'NO_EG'])
  })
})
