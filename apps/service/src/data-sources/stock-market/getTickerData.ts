import { TickerData } from '@repo/types'
import { parseHTML } from 'linkedom'
import { getText, getFinStreamerText, getTestIdText, getStatisticText } from './getText'
import { getOptionalStatisticText } from './getText/getOptionalStatisticText'
import { toNumber } from './toNumber'
import { getOptionalTestIdText } from './getText/getOptionalTestIdText'
import { getOptionalText } from './getText/getOptionalText'

export const getTickerData = async (ticker: string): Promise<TickerData> => {
  const req = fetch(`https://finance.yahoo.com/quote/${ticker}`)
  console.log(`Fetching ${ticker} ticker data`)
  const document = await req
    .then(resp => resp.text())
    .then(html => parseHTML(html))
    .then(window => window.document)

  const isAtMarketClosed = getText(document, '.primary .marketTimeNotice').startsWith('At close:')
  const spotPrice = isAtMarketClosed ? undefined : getTestIdText(document, 'qsp-price')
  const priceAtClose = isAtMarketClosed
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
  const overnightPrice =
    getOptionalTestIdText(document, 'qsp-post-price') ?? getOptionalTestIdText(document, 'qsp-overnight-price')
  const preMarketPrice = getOptionalTestIdText(document, 'qsp-pre-price')
  const marketTime =
    getOptionalText(document, '.secondary .marketTimeNotice') ?? getText(document, '.primary .marketTimeNotice')

  return {
    ticker,
    title,
    marketTime,
    price: {
      overnight: overnightPrice,
      preMarket: preMarketPrice,
      atClose: priceAtClose,
      atOpen: priceAtOpen,
      spot: spotPrice,
    },
    daily: {
      isAtMarketClosed,
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
