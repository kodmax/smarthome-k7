import { getFinStreamerText, getStatisticText, getText } from './getText'
import { getOptionalStatisticText } from './getText/getOptionalStatisticText'
import { toNumber } from './toNumber'
import { getDocument } from './getDocument'
import { YahooTickerData } from '../types'
import { convertMarketCap } from './convertToBillions'

export const getTickerData = async (ticker: string): Promise<YahooTickerData> => {
  const mainPage = await getDocument(ticker)

  const oneYearPriceTarget = toNumber(getFinStreamerText(mainPage, 'targetMeanPrice'))

  const confirmedEarningsDate = getOptionalStatisticText(mainPage, 'Earnings Date')
  const estimatedEarningsDate = getOptionalStatisticText(mainPage, 'Earnings Date (est.)')

  const forwardPE = toNumber(getText(mainPage, '[data-testid="valuation-measures"] li:nth-child(4) p:nth-child(2)'))
  const previousClosePrice = toNumber(getStatisticText(mainPage, 'Previous Close'))
  const eps = toNumber(getStatisticText(mainPage, 'EPS (TTM)'))

  const marketCap = getStatisticText(mainPage, 'Market Cap')

  return {
    ticker,
    oneYearPriceTarget,
    marketCap: convertMarketCap(marketCap),
    forwardEPS: !isNaN(forwardPE) ? previousClosePrice / forwardPE : null,
    trailingEPS: eps,
    earningsDate: {
      confirmed: confirmedEarningsDate,
      estimated: estimatedEarningsDate,
    },
  }
}
