import { TickerData } from '@repo/types'
import { getTickerData } from './getTickerData'

export const getTickersData = async (tickerList: string[]): Promise<TickerData[]> => {
  const tickers: TickerData[] = []
  for (const ticker of tickerList) {
    tickers.push(await getTickerData(ticker))
  }

  return tickers
}
