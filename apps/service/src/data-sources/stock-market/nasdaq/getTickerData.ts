import { TickerData } from '@repo/types'
import { getQuoteInfo } from './getQuoteInfo'
import { getQuoteSummary } from './getQuoteSummary'

export const getTickerData = async (ticker: string): Promise<TickerData> => {
  const summary = await getQuoteSummary(ticker)
  const info = await getQuoteInfo(ticker)

  return {
    ticker,
    title: info.companyName,
    lastTradeTimestamp: info.primaryData.lastTradeTimestamp,
    lastTradePrice: (+info.primaryData.lastSalePrice.replaceAll(/^\$|,/g, '')).toFixed(2),
    priceTarget: (+summary.summaryData.OneYrTarget.value.replaceAll(/^\$|,/g, '')).toFixed(2),
    marketStatus: info.marketStatus,
  }
}
