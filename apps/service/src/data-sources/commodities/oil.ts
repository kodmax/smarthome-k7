import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/scraperMetrics'
import { parseOilPriceFromDocument } from './parseFromDocument'

type OilPrice = {
  l: string
}

const fetchOilPrice = async (): Promise<OilPrice> => {
  const url = 'https://www.cnbc.com/quotes/@CL.1'
  const document = await observeHttpFetch(url, 'html', () => fetchDocument(url, { accept: 'text/html' }))
  return parseOilPriceFromDocument(document)
}

export type { OilPrice }
export { fetchOilPrice }
