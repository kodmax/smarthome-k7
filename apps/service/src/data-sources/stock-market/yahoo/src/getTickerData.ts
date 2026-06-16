import { getFinStreamerText } from './getText'
import { getOptionalStatisticText } from './getText/getOptionalStatisticText'
import { toNumber } from './toNumber'
import { getDocument } from './getDocument'
import { YahooTickerData } from '../types'

export const getTickerData = async (ticker: string): Promise<YahooTickerData> => {
  const document = await getDocument(ticker)

  const oneYearPriceTarget = toNumber(getFinStreamerText(document, 'targetMeanPrice')).toFixed(2)
  const confirmedEarningsDate = getOptionalStatisticText(document, 'Earnings Date')
  const estimatedEarningsDate = getOptionalStatisticText(document, 'Earnings Date (est.)')

  return {
    ticker,
    oneYearPriceTarget,
    earningsDate: {
      confirmed: confirmedEarningsDate,
      estimated: estimatedEarningsDate,
    },
  }
}
