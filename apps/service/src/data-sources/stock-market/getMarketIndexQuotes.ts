import { MarketIndices } from '@repo/types'
import { FetchError } from '@/fetch/FetchError'
import { getChartQuote } from './yahoo/src/getChartQuote'

const MAX_FETCH_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 3000

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

const getRetryDelayMs = (attempt: number) => RETRY_BASE_DELAY_MS * 2 ** (attempt - 1)

const fetchMarketIndexQuotes = (): Promise<MarketIndices> =>
  Promise.all([
    getChartQuote({
      symbol: '^GSPC',
      title: 'S&P 500',
      chartSymbol: '^GSPC',
    }),
    getChartQuote({
      symbol: 'ES=F',
      title: 'S&P 500 Futures',
      chartSymbol: 'ES=F',
    }),
  ]).then(([sp500, sp500Futures]) => ({ sp500, sp500Futures }))

export const getMarketIndexQuotes = async (): Promise<MarketIndices> => {
  let lastError: unknown

  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
    try {
      return await fetchMarketIndexQuotes()
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
