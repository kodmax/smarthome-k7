import { TickerData } from '@repo/types'
import { parseHTML } from 'linkedom'
import { getText, getFinStreamerText, getTestIdText, getStatisticText } from './getText'
import { getOptionalStatisticText } from './getText/getOptionalStatisticText'
import { toNumber } from './toNumber'
import { getOptionalTestIdText } from './getText/getOptionalTestIdText'

export const getTickerData = async (ticker: string): Promise<TickerData> => {
  const req = fetch(`https://finance.yahoo.com/quote/${ticker}`)
  console.log(`Fetching ${ticker} ticker data`)
  const document = await req
    .then(resp => resp.text())
    .then(html => parseHTML(html))
    .then(window => window.document)

  const marketTime = getText(document, '.marketTimeNotice')
  const isAtMarketClose = marketTime.startsWith('At close:')

  const spotPrice = isAtMarketClose ? undefined : getTestIdText(document, 'qsp-price')
  const priceAtClose = isAtMarketClose
    ? getTestIdText(document, 'qsp-price')
    : getFinStreamerText(document, 'regularMarketPreviousClose')
  const priceTarget = getFinStreamerText(document, 'targetMeanPrice')
  const title = getTestIdText(document, 'quote-title')
  const priceAtOpen = getFinStreamerText(document, 'regularMarketOpen')
  const marketCap =
    getOptionalStatisticText(document, 'Market Cap (intraday)') ?? getStatisticText(document, 'Market Cap')
  const eps = getStatisticText(document, 'EPS (TTM)')
  const pe = toNumber(eps) > 0 ? getStatisticText(document, 'PE Ratio (TTM)') : undefined
  const confirmedEarningsDate = getOptionalStatisticText(document, 'Earnings Date')
  const estimatedEarningsDate = getOptionalStatisticText(document, 'Earnings Date (est.)')
  const overnightPrice = getOptionalTestIdText(document, 'qsp-overnight-price')
  const preMarketPrice = getOptionalTestIdText(document, 'qsp-pre-price')

  return {
    ticker,
    title,
    price: {
      overnight: overnightPrice,
      preMarket: preMarketPrice,
      atClose: priceAtClose,
      atOpen: priceAtOpen,
      spot: spotPrice,
    },
    daily: {
      isAtMarketClose,
      marketTime,
      priceTarget,
      marketCap,
      eps,
      pe,
    },
    earningsDate: {
      confirmed: confirmedEarningsDate,
      estimated: estimatedEarningsDate,
    },
  }
}
