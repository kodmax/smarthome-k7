import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/httpMetrics'
import { parseBtcPriceFromDocument } from './parseFromDocument'

type BtcPrice = {
  usd: string
}

const fetchBtcPrice = async (): Promise<BtcPrice> => {
  const url = 'https://www.cnbc.com/quotes/BTC.BS='
  const document = await observeHttpFetch(url, 'html', () => fetchDocument(url, { accept: 'text/html' }))
  return parseBtcPriceFromDocument(document)
}

export type { BtcPrice }
export { fetchBtcPrice }
