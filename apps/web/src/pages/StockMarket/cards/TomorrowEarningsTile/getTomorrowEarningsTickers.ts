import { TickerData } from '@repo/types'

const getEarningsDaysLeft = (item: TickerData): number | null => {
  const date = item.earningsDate.confirmed ?? item.earningsDate.estimated
  if (date === undefined) {
    return null
  }

  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
}

export const getTomorrowEarningsTickers = (tickers: TickerData[]): TickerData[] =>
  tickers.filter(ticker => getEarningsDaysLeft(ticker) === 1)
