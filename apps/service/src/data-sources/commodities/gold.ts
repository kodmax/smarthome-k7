import { getNumberContent } from '../utils/get-number-content'
import { myFetch } from '../../fetch'
import { JSDOM } from 'jsdom'

type GoldPrice = {
  g: string
  oz: string
  history?: History
}

const fetchGoldPrice = (): Promise<GoldPrice> => {
  return myFetch('https://markets.businessinsider.com/commodities/gold-price', { accept: 'text/html' })
    .then(response => response.toString('utf-8'))
    .then(html => {
      const document = new JSDOM(html).window.document

      // 1 ounce = 28.3495231 grams
      const price = getNumberContent(document.body, '.price-section__current-value')
      return {
        g: Number(price / 28.3495231).toFixed(2),
        oz: Number(price).toFixed(0),
      }
    })
}

export type { GoldPrice }
export { fetchGoldPrice }
