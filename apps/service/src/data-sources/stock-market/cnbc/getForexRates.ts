import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/httpMetrics'
import { CnbcForexData } from './types'
import { parseFXFromDocument } from './parseFX'

const USD_PLN_URL = 'https://www.cnbc.com/quotes/PLN='
const EUR_PLN_URL = 'https://www.cnbc.com/quotes/EURPLN='

export const getForexRates = async (): Promise<CnbcForexData> => {
  const [usdPlnDocument, eurPlnDocument] = await Promise.all([
    observeHttpFetch(USD_PLN_URL, 'html', () => fetchDocument(USD_PLN_URL, { accept: 'text/html' })),
    observeHttpFetch(EUR_PLN_URL, 'html', () => fetchDocument(EUR_PLN_URL, { accept: 'text/html' })),
  ])

  return {
    usdPln: parseFXFromDocument(usdPlnDocument, 'PLN=', 'USD/PLN'),
    eurPln: parseFXFromDocument(eurPlnDocument, 'EURPLN=', 'EUR/PLN'),
  }
}
