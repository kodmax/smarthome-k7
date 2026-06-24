import { QuoteSummary } from '@repo/types'

export type YahooTickerData = {
  ticker: string
  oneYearPriceTarget: number
  trailingEPS: number
  forwardEPS: number | null
  marketCap: number
  earningsDate: {
    confirmed?: string
    estimated?: string
  }
  quoteSummary: QuoteSummary
}
