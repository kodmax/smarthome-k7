import { MarketIndexQuote } from '@repo/types'
import { fetchJSON } from '@/fetch'
import { FetchError } from '@/fetch/FetchError'
import { observeHttpFetch } from '@/prometheus/httpMetrics'
import { buildChartQuoteUrl, ChartQuoteRequest, parseChartQuote, YahooChartResponse } from './parseChartQuote'

export const getChartQuote = async (request: ChartQuoteRequest): Promise<MarketIndexQuote> => {
  try {
    const url = buildChartQuoteUrl(request.chartSymbol)
    const response = await observeHttpFetch(url, 'json', () => fetchJSON<YahooChartResponse>(url))

    return parseChartQuote(response, request)
  } catch (error) {
    if (error instanceof FetchError) {
      throw error
    }

    if (error instanceof Error) {
      throw new Error(`yahoo:${request.chartSymbol}: ${error.message}`, { cause: error })
    }

    throw error
  }
}
