import { QuoteSummary } from '@repo/types'
import { getApiData } from '../getApiData/getAPIData'
import { getPriceTargetChange } from './getPriceTargetChange'
import { QuoteSummaryResponse } from './types'

export const getQuoteSumary = (document: Document, ticker: string): QuoteSummary => {
  const financials = getApiData<QuoteSummaryResponse>(
    document,
    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
  )
  const quoteSummary = financials.quoteSummary.result[0]
  const ratingHistory = quoteSummary.upgradeDowngradeHistory.history

  return {
    priceTargetChange: {
      last90days: getPriceTargetChange(ratingHistory, 90),
      last30days: getPriceTargetChange(ratingHistory, 30),
      last7days: getPriceTargetChange(ratingHistory, 7),
    },
  }
}
