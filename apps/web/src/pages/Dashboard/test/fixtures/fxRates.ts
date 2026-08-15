import { type FxRatesFeed } from '@repo/types'

const defaultFxRates: FxRatesFeed = {
  usdPln: {
    symbol: 'USDPLN=X',
    title: 'USD/PLN',
    price: 3.8056,
    netChange: 0.0172,
    percentageChange: 0.45,
  },
  eurPln: {
    symbol: 'EURPLN=X',
    title: 'EUR/PLN',
    price: 4.33,
    netChange: 0.0074,
    percentageChange: 0.17,
  },
}

export function fxRatesFeed(overrides?: Partial<FxRatesFeed>): FxRatesFeed {
  return { ...defaultFxRates, ...overrides }
}
