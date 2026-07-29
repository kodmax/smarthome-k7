import { getNumberContent } from '@/utils/get-number-content'
import { withScraperSource } from '@/utils/scraper'
import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/scraperMetrics'

type CoalPrice = {
  ton: string
}

const fetchCoalPrice = async (): Promise<CoalPrice> => {
  const url = 'https://markets.businessinsider.com/commodities/coal-price'
  const document = await observeHttpFetch(url, 'html', () => fetchDocument(url, { accept: 'text/html' }))
  return withScraperSource('coal', () => ({
    ton: getNumberContent(document.body, '.price-section__current-value').toFixed(0),
  }))
}

export type { CoalPrice }
export { fetchCoalPrice }
