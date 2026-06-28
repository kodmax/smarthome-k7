import { getNumberContent } from '@/utils/get-number-content'
import { withScraperSource } from '@/utils/scraper'
import { fetchDocument } from '@/fetch'

type BtcPrice = {
  usd: string
}

const fetchBtcPrice = async (): Promise<BtcPrice> => {
  return fetchDocument('https://www.cnbc.com/quotes/BTC.BS=', { accept: 'text/html' }).then(document =>
    withScraperSource('btc', () => {
      const usd = getNumberContent(document.body, '.QuoteStrip-lastPrice').toFixed(2)

      return { usd }
    }),
  )
}

export type { BtcPrice }
export { fetchBtcPrice }
