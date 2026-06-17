import { getQuoteInfo } from './getQuoteInfo'
import { NasdaqTickerData } from '../types'

export const getTickerData = async (ticker: string): Promise<NasdaqTickerData> => {
  const info = await getQuoteInfo(ticker)

  return {
    ticker,
    exchange: info.exchange,
    title: info.companyName,
    marketStatus: info.marketStatus,
    price: {
      lastTradeTimestamp: info.primaryData.lastTradeTimestamp,
      lastTradePrice: +info.primaryData.lastSalePrice.replaceAll(/^\$|,/g, ''),
      percentageChange: +info.primaryData.percentageChange.replace('%', ''),
      netChange: +info.primaryData.netChange,
    },
  }
}
