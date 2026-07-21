import { TickerData } from '@repo/types'

export const sortHighUpsideTickers = (tickers: TickerData[]): TickerData[] =>
  tickers
    .filter(item => item.statistics.forwardEPS !== null && item.price.eg !== null && item.price.eg > 40)
    .sort((a, b) => (b.price.eg ?? 0) - (a.price.eg ?? 0))
