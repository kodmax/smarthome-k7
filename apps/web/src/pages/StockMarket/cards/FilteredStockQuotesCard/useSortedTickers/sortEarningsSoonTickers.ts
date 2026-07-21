import { TickerData } from '@repo/types'
import { getEarningsDaysLeft } from './getEarningsDaysLeft'

export const sortEarningsSoonTickers = (tickers: TickerData[]): TickerData[] =>
  tickers
    .filter(item => getEarningsDaysLeft(item) !== null)
    .sort((a, b) => (getEarningsDaysLeft(a) ?? Infinity) - (getEarningsDaysLeft(b) ?? Infinity))
