import { type MarketInfo, type StockMarketFeed, type TickerData } from '@repo/types'

const emptyQuoteSummary: TickerData['quoteSummary'] = {
  ratingsCount: { last90days: 0, last30days: 0, last7days: 0 },
  priceTarget: { last90days: null, last30days: null, last7days: null },
  priceTargetChange: { last90days: null, last30days: null, last7days: null },
}

const defaultMarketInfo: MarketInfo = {
  country: 'U.S.',
  status: 'Open',
  indicator: 'Market Open',
  uiIndicator: 'Market Open',
  countdown: 'Closes in 6H 30M',
  marketCountdown: 'Market Closes in 6H 30M',
  isBusinessDay: true,
  previousTradeDate: 'Jul 6, 2026',
  nextTradeDate: 'Jul 8, 2026',
  preMarketOpeningTime: 'Jul 7, 2026 04:00 AM ET',
  preMarketClosingTime: 'Jul 7, 2026 09:30 AM ET',
  marketOpeningTime: 'Jul 7, 2026 09:30 AM ET',
  marketClosingTime: 'Jul 7, 2026 04:00 PM ET',
  afterHoursMarketOpeningTime: 'Jul 7, 2026 04:00 PM ET',
  afterHoursMarketClosingTime: 'Jul 7, 2026 08:00 PM ET',
  schedule: {
    preMarketOpen: '2026-07-07T04:00:00',
    marketOpen: '2026-07-07T09:30:00',
    marketClose: '2026-07-07T16:00:00',
    afterHoursClose: '2026-07-07T20:00:00',
  },
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
    statistics: { trailingEPS: 5, forwardEPS: 6, ...statistics },
    earningsDate: {},
    quoteSummary: emptyQuoteSummary,
    symbol,
    ...rest,
  }
}

export function stockMarketFeed(...tickers: TickerData[]): StockMarketFeed {
  return { marketInfo: defaultMarketInfo, tickers }
}
