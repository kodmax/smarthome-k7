import { getNumberContent } from '../utils/get-number-content'
import { myFetch } from '../../fetch'
import { parseHTML } from 'linkedom'

type BtcPrice = {
  usd: string
}

const fetchBtcPrice = async (): Promise<BtcPrice> => {
  return myFetch('https://www.cnbc.com/quotes/BTC.BS=', { accept: 'text/html' })
    .then(response => response.toString())
    .then(html => {
      const document = parseHTML(html).window.document
      const usd = getNumberContent(document.body, '.QuoteStrip-lastPrice').toFixed(2)

      return {
        usd,
      }
    })
}

export type { BtcPrice }
export { fetchBtcPrice }
