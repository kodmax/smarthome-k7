import { fetchJSON } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/scraperMetrics'
import { NasdaqApiQuoteSummary, NasdaqApiResponse } from './types'

const nasdaqHeaders = {
  accept: 'application/json, text/plain, */*',
  'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
  priority: 'u=1, i',
  'sec-ch-ua': '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  Referer: 'https://www.nasdaq.com/',
}

export const getQuoteSummary = async (ticker: string): Promise<NasdaqApiQuoteSummary> => {
  const url = `https://api.nasdaq.com/api/quote/${ticker}/summary?assetclass=stocks`
  const resp = await observeHttpFetch(url, 'json', () =>
    fetchJSON<NasdaqApiResponse<NasdaqApiQuoteSummary>>(url, nasdaqHeaders),
  )
  return resp.data
}
