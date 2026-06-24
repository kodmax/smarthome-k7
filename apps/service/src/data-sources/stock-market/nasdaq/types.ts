import { ExchangeStatus } from '@repo/types'

export type NasdaqTickerData = {
  ticker: string
  title: string
  exchange: 'NASDAQ-GS' | 'NYSE'
  marketStatus: ExchangeStatus
  price: {
    lastTradeTimestamp: string
    lastTradePrice: number
    netChange: number
    percentageChange: number
  }
}
