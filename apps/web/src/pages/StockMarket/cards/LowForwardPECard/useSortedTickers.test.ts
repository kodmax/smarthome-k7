import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { calcPEAtPT } from '@/pages/Dashboard/cards/stock-market/Ticker/cells/calcPEAtPT'
import { useSortedTickers } from './useSortedTickers'

describe('LowForwardPECard useSortedTickers', () => {
  it('returns undefined when feed is undefined', () => {
    const { result } = renderHook(() => useSortedTickers(undefined))

    expect(result.current).toBeUndefined()
  })

  it('excludes tickers without forward PE at price target', () => {
    const { result } = renderHook(() =>
      useSortedTickers(
        stockMarketFeed(
          ticker({ symbol: 'AAA', price: { priceTarget: 120 }, statistics: { forwardEPS: 6 } }),
          ticker({ symbol: 'BBB', price: { priceTarget: null }, statistics: { forwardEPS: 6 } }),
        ),
      ),
    )

    expect(result.current?.map(item => item.symbol)).toEqual(['AAA'])
  })

  it('excludes tickers with forward PE at price target above 25', () => {
    const { result } = renderHook(() =>
      useSortedTickers(
        stockMarketFeed(
          ticker({ symbol: 'OK', price: { priceTarget: 120 }, statistics: { forwardEPS: 6 } }),
          ticker({ symbol: 'HIGH', price: { priceTarget: 160 }, statistics: { forwardEPS: 6 } }),
        ),
      ),
    )

    expect(result.current?.map(item => item.symbol)).toEqual(['OK'])
  })

  it('includes tickers with forward PE at price target equal to 25', () => {
    const { result } = renderHook(() =>
      useSortedTickers(
        stockMarketFeed(ticker({ symbol: 'EDGE', price: { priceTarget: 150 }, statistics: { forwardEPS: 6 } })),
      ),
    )

    expect(calcPEAtPT(result.current![0]!).forwardPEAtPriceTarget).toBe(25)
    expect(result.current?.map(item => item.symbol)).toEqual(['EDGE'])
  })

  it('sorts tickers by ascending forward-to-trailing PE factor at price target', () => {
    const { result } = renderHook(() =>
      useSortedTickers(
        stockMarketFeed(
          ticker({
            symbol: 'HIGHER_FACTOR',
            price: { priceTarget: 120 },
            statistics: { trailingEPS: 6, forwardEPS: 8 },
          }),
          ticker({
            symbol: 'LOWER_FACTOR',
            price: { priceTarget: 120 },
            statistics: { trailingEPS: 6, forwardEPS: 12 },
          }),
        ),
      ),
    )

    expect(result.current?.map(item => item.symbol)).toEqual(['LOWER_FACTOR', 'HIGHER_FACTOR'])
  })
})
