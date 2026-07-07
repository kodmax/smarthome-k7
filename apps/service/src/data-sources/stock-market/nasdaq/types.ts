import { MarketInfo, MarketStatus } from '@repo/types'

export type NasdaqTickerData = {
  ticker: string
  title: string
  exchange: 'NASDAQ-GS' | 'NYSE'
  marketStatus: MarketStatus
  price: {
    lastTradeTimestamp: string
    lastTradePrice: number
    netChange: number
    percentageChange: number
  }
}

export type NasdaqMarketInfo = MarketInfo

export type NasdaqMarketData = {
  tickers: NasdaqTickerData[]
  marketInfo: NasdaqMarketInfo
}
