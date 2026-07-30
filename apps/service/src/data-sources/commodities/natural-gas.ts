import { getNumberContent } from '@/utils/get-number-content'
import { withScraperSource } from '@/utils/scraper'
import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/httpMetrics'

type NaturalGasPrice = {
  GJ: string
  MWh: string
  MMBTU: string
}

const fetchNaturalGasPrice = async (): Promise<NaturalGasPrice> => {
  const url = 'https://www.cnbc.com/quotes/@NG.1'
  const document = await observeHttpFetch(url, 'html', () => fetchDocument(url, { accept: 'text/html' }))
  return withScraperSource('natural-gas', () => {
    // 1 MWh = 3.412142 MMBTU = 3.6 GJ
    const price = getNumberContent(document.body, '.QuoteStrip-lastPrice')
    return {
      GJ: Number((price * 3.412142) / 3.6).toFixed(2),
      MWh: Number(price * 3.412142).toFixed(2),
      MMBTU: price.toFixed(2),
    }
  })
}

export type { NaturalGasPrice }
export { fetchNaturalGasPrice }
