import { describe, expect, it } from 'vitest'
import { ticker } from '@/pages/Dashboard/test/fixtures/stockMarket'
import { calcPEAtPT } from './calcPEAtPT'

describe('calcPEAtPT', () => {
  it('calculates trailing and forward PE at price target', () => {
    const values = calcPEAtPT(
      ticker({
        symbol: 'AAA',
        price: { lastTradePrice: 100, priceTarget: 120 },
        statistics: { trailingEPS: 5, forwardEPS: 6 },
      }),
    )

    expect(values.trailingPEAtPriceTarget).toBeCloseTo(24)
    expect(values.forwardPEAtPriceTarget).toBeCloseTo(20)
  })

  it('returns null when required inputs are missing', () => {
    expect(
      calcPEAtPT(
        ticker({
          symbol: 'BBB',
          price: { priceTarget: null },
          statistics: { trailingEPS: 0, forwardEPS: null },
        }),
      ),
    ).toEqual({
      trailingPEAtPriceTarget: null,
      forwardPEAtPriceTarget: null,
    })
  })
})
