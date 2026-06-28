import { type StockMarketFeed, type TickerData } from '@repo/types'

const emptyQuoteSummary: TickerData['quoteSummary'] = {
  ratingsCount: { last90days: 0, last30days: 0, last7days: 0 },
  priceTarget: { last90days: null, last30days: null, last7days: null },
  priceTargetChange: { last90days: null, last30days: null, last7days: null },
}

type TickerOverrides = Omit<Partial<TickerData>, 'price' | 'statistics'> &
  Pick<TickerData, 'symbol'> & {
    price?: Partial<TickerData['price']>
    statistics?: Partial<TickerData['statistics']>
  }

export function ticker(overrides: TickerOverrides): TickerData {
  const { symbol, price, statistics, ...rest } = overrides

  return {
    title: symbol,
    marketCap: 1_000_000_000,
    exchange: { name: 'NASDAQ-GS', status: 'Open' },
    price: {
      lastTradeTimestamp: '2026-06-28T12:00:00Z',
      lastTradePrice: 100,
      netChange: 1,
      percentageChange: 1,
      oneYearTarget: null,
      priceTarget: 120,
      eg: 10,
      ...price,
    },
    eps: { forecast: [], ttm: [] },
    statistics: { trailingEPS: 5, forwardEPS: 6, ...statistics },
    earningsDate: {},
    quoteSummary: emptyQuoteSummary,
    symbol,
    ...rest,
  }
}

export function stockMarketFeed(...tickers: TickerData[]): StockMarketFeed {
  return { tickers }
}
