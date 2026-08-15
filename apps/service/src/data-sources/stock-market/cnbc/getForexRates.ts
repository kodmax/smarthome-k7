import { fetchDocument } from '@/fetch'
import { FetchError } from '@/fetch/FetchError'
import { observeHttpFetch } from '@/prometheus/httpMetrics'
import { CnbcForexData } from './types'
import { parseFXFromDocument } from './parseFX'

const USD_PLN_URL = 'https://www.cnbc.com/quotes/PLN='
const EUR_PLN_URL = 'https://www.cnbc.com/quotes/EURPLN='
const MAX_FETCH_ATTEMPTS = 3
const RETRY_DELAY_MS = 1000

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

const fetchDocumentWithRetry = async (url: string): Promise<Document> => {
  let lastError: unknown

  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
    try {
      return await observeHttpFetch(url, 'html', () => fetchDocument(url, { accept: 'text/html' }))
    } catch (error) {
      lastError = error
      if (!(error instanceof FetchError) || attempt === MAX_FETCH_ATTEMPTS) {
        throw error
      }
      await sleep(RETRY_DELAY_MS)
    }
  }

  throw lastError
}

export const getForexRates = async (): Promise<CnbcForexData> => {
  const [usdPlnDocument, eurPlnDocument] = await Promise.all([
    fetchDocumentWithRetry(USD_PLN_URL),
    fetchDocumentWithRetry(EUR_PLN_URL),
  ])

  return {
    usdPln: parseFXFromDocument(usdPlnDocument, 'PLN=', 'USD/PLN'),
    eurPln: parseFXFromDocument(eurPlnDocument, 'EURPLN=', 'EUR/PLN'),
  }
}
