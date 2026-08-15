import { ForexRates } from '@repo/types'
import { FetchError } from '@/fetch/FetchError'
import { getChartQuote } from './yahoo/src/getChartQuote'

const MAX_FETCH_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 3000

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

const getRetryDelayMs = (attempt: number) => RETRY_BASE_DELAY_MS * 2 ** (attempt - 1)

const fetchForexRates = (): Promise<ForexRates> =>
  Promise.all([
    getChartQuote({
      symbol: 'USDPLN=X',
      title: 'USD/PLN',
      chartSymbol: 'USDPLN=X',
    }),
    getChartQuote({
      symbol: 'EURPLN=X',
      title: 'EUR/PLN',
      chartSymbol: 'EURPLN=X',
    }),
  ]).then(([usdPln, eurPln]) => ({ usdPln, eurPln }))

export const getForexRates = async (): Promise<ForexRates> => {
  let lastError: unknown

  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
    try {
      return await fetchForexRates()
    } catch (error) {
      lastError = error
      if (!(error instanceof FetchError) || attempt === MAX_FETCH_ATTEMPTS) {
        throw error
      }
      await sleep(getRetryDelayMs(attempt))
    }
  }

  throw lastError
}
