export type YahooTickerData = {
  ticker: string
  oneYearPriceTarget: number
  trailingEPS: number
  forwardEPS: number | null
  marketCap: string
  earningsDate: {
    confirmed?: string
    estimated?: string
  }
}
