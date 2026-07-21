import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { stockMarketFeed, ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { useSortedTickers } from './useSortedTickers'

describe('useSortedTickers', () => {
  it('returns undefined when feed is undefined', () => {
    const { result } = renderHook(() => useSortedTickers(undefined, 'high-upside'))

    expect(result.current).toBeUndefined()
  })

  it('delegates sorting to the selected filter', () => {
    const { result } = renderHook(() =>
      useSortedTickers(
        stockMarketFeed(ticker({ symbol: 'LOW', price: { eg: 45 } }), ticker({ symbol: 'HIGH', price: { eg: 60 } })),
        'high-upside',
      ),
    )

    expect(result.current?.map(item => item.symbol)).toEqual(['HIGH', 'LOW'])
  })
})
