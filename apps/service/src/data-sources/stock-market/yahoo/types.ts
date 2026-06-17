export type YahooTickerData = {
  ticker: string
  oneYearPriceTarget: number
  trailingEPS: number
  forwardEPS: number | null
  earningsDate: {
    confirmed?: string
    estimated?: string
  }
}
