import { getNumberContent } from '../utils/get-number-content'
import { withScraperSource } from '../utils/require-scraper'
import { fetchDocument } from '@/fetch'

type CoalPrice = {
  ton: string
}

const fetchCoalPrice = async (): Promise<CoalPrice> => {
  return fetchDocument('https://markets.businessinsider.com/commodities/coal-price', { accept: 'text/html' }).then(
    document =>
      withScraperSource('coal', () => ({
        ton: getNumberContent(document.body, '.price-section__current-value').toFixed(0),
      })),
  )
}

export type { CoalPrice }
export { fetchCoalPrice }
