import { QuoteSummary } from '@repo/types'
import { getApiData } from '../getApiData/getAPIData'
import { getPriceTargetChange } from './getPriceTargetChange'
import { QuoteSummaryResponse } from './types'
import { getPriceTarget } from './getPriceTarget'
import { getLastRatings } from './getLastRatings'

export const getQuoteSumary = (document: Document, ticker: string): QuoteSummary => {
  const financials = getApiData<QuoteSummaryResponse>(
    document,
    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
  )
  const quoteSummary = financials.quoteSummary.result[0]
  const ratingHistory = quoteSummary.upgradeDowngradeHistory.history

  const last90daysRatings = getLastRatings(ratingHistory, 90)
  const last30daysRatings = getLastRatings(last90daysRatings, 30)
  const last7daysRatings = getLastRatings(last30daysRatings, 7)

  return {
    ratingsCount: {
      last90days: last90daysRatings.length,
      last30days: last30daysRatings.length,
      last7days: last7daysRatings.length,
    },
    priceTarget: {
      last90days: getPriceTarget(last90daysRatings),
      last30days: getPriceTarget(last30daysRatings),
      last7days: getPriceTarget(last7daysRatings),
    },
    priceTargetChange: {
      last90days: getPriceTargetChange(last90daysRatings),
      last30days: getPriceTargetChange(last30daysRatings),
      last7days: getPriceTargetChange(last7daysRatings),
    },
  }
}
