import { getNumberContent } from '@/utils/get-number-content'
import { withScraperSource } from '@/utils/scraper'
import { fetchDocument } from '@/fetch'

type GoldPrice = {
  g: string
  oz: string
}

const fetchGoldPrice = (): Promise<GoldPrice> => {
  return fetchDocument('https://markets.businessinsider.com/commodities/gold-price', { accept: 'text/html' }).then(
    document =>
      withScraperSource('gold', () => {
        // 1 ounce = 28.3495231 grams
        const price = getNumberContent(document.body, '.price-section__current-value')
        return {
          g: Number(price / 28.3495231).toFixed(2),
          oz: Number(price).toFixed(0),
        }
      }),
  )
}

export type { GoldPrice }
export { fetchGoldPrice }
