import { type MarketIndices, type MarketInfo, type StockMarketFeed, type TickerData } from '@repo/types'

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
  previousTradeDate: 1783310400000,
  nextTradeDate: 1783483200000,
  preMarketOpeningTime: 1783411200000,
  preMarketClosingTime: 1783431000000,
  marketOpeningTime: 1783431000000,
  marketClosingTime: 1783454400000,
  afterHoursMarketOpeningTime: 1783454400000,
  afterHoursMarketClosingTime: 1783468800000,
}

const defaultMarketIndices: MarketIndices = {
  sp500: {
    symbol: '.SPX',
    title: 'S&P 500',
    price: 7498.96,
    netChange: -10.24,
    percentageChange: -0.14,
  },
  sp500Futures: {
    symbol: '@SP.1',
    title: 'S&P 500 Futures',
    price: 7512.25,
    netChange: -28,
    percentageChange: -0.37,
  },
}

type QuoteSummaryOverrides = {
  ratingsCount?: Partial<TickerData['quoteSummary']['ratingsCount']>
  priceTarget?: Partial<TickerData['quoteSummary']['priceTarget']>
  priceTargetChange?: Partial<TickerData['quoteSummary']['priceTargetChange']>
}

type TickerOverrides = Omit<Partial<TickerData>, 'price' | 'statistics' | 'quoteSummary'> &
  Pick<TickerData, 'symbol'> & {
    price?: Partial<TickerData['price']>
    statistics?: Partial<TickerData['statistics']>
    quoteSummary?: QuoteSummaryOverrides
  }

export function ticker(overrides: TickerOverrides): TickerData {
  const { symbol, price, statistics, quoteSummary, ...rest } = overrides

  return {
    title: symbol,
    marketCap: 1_000_000_000,
    exchange: 'NASDAQ-GS',
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
    quoteSummary: {
      ...emptyQuoteSummary,
      ...quoteSummary,
      priceTargetChange: {
        ...emptyQuoteSummary.priceTargetChange,
        ...quoteSummary?.priceTargetChange,
      },
      priceTarget: {
        ...emptyQuoteSummary.priceTarget,
        ...quoteSummary?.priceTarget,
      },
      ratingsCount: {
        ...emptyQuoteSummary.ratingsCount,
        ...quoteSummary?.ratingsCount,
      },
    },
    symbol,
    ...rest,
  }
}

export function stockMarketFeed(...tickers: TickerData[]): StockMarketFeed {
  return { marketInfo: defaultMarketInfo, marketIndices: defaultMarketIndices, tickers }
}
