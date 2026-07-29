import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/scraperMetrics'
import { parseGoldPriceFromDocument } from './parseFromDocument'

type GoldPrice = {
  g: string
  oz: string
}

const fetchGoldPrice = async (): Promise<GoldPrice> => {
  const url = 'https://markets.businessinsider.com/commodities/gold-price'
  const document = await observeHttpFetch(url, 'html', () => fetchDocument(url, { accept: 'text/html' }))
  return parseGoldPriceFromDocument(document)
}

export type { GoldPrice }
export { fetchGoldPrice }
