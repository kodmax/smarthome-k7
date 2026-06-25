import { NasdaqEPSData } from '../types'
import { getForecast } from './getForecast'
import { getTTM } from './getTTM'

export const getTickerData = async (ticker: string): Promise<NasdaqEPSData> => {
  return {
    forecast: await getForecast(ticker),
    ttm: await getTTM(ticker),
    ticker,
  }
}
