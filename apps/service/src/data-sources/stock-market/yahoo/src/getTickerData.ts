import { getFinStreamerText, getStatisticText, getText } from './getText'
import { getOptionalStatisticText } from './getText/getOptionalStatisticText'
import { toNumber } from './toNumber'
import { getDocument } from './getDocument'
import { YahooTickerData } from '../types'

export const getTickerData = async (ticker: string): Promise<YahooTickerData> => {
  const mainPage = await getDocument(ticker)

  const oneYearPriceTarget = toNumber(getFinStreamerText(mainPage, 'targetMeanPrice'))

  const confirmedEarningsDate = getOptionalStatisticText(mainPage, 'Earnings Date')
  const estimatedEarningsDate = getOptionalStatisticText(mainPage, 'Earnings Date (est.)')

  const trailingPE = toNumber(getText(mainPage, '[data-testid="valuation-measures"] li:nth-child(3) p:nth-child(2)'))
  const forwardPE = toNumber(getText(mainPage, '[data-testid="valuation-measures"] li:nth-child(4) p:nth-child(2)'))
  const eps = toNumber(getStatisticText(mainPage, 'EPS (TTM)'))

  return {
    ticker,
    oneYearPriceTarget,
    forwardEPS: !isNaN(forwardPE) && !isNaN(trailingPE) ? +((eps * trailingPE) / forwardPE).toFixed(2) : null,
    trailingEPS: eps,
    earningsDate: {
      confirmed: confirmedEarningsDate,
      estimated: estimatedEarningsDate,
    },
  }
}
