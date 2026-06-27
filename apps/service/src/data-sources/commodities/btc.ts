import { getNumberContent } from '../utils/get-number-content'
import { getHTML } from '../../fetch'

type BtcPrice = {
  usd: string
}

const fetchBtcPrice = async (): Promise<BtcPrice> => {
  return getHTML('https://www.cnbc.com/quotes/BTC.BS=', { accept: 'text/html' }).then(document => {
    const usd = getNumberContent(document.body, '.QuoteStrip-lastPrice').toFixed(2)

    return {
      usd,
    }
  })
}

export type { BtcPrice }
export { fetchBtcPrice }
