import { fetchJSON } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/httpMetrics'
import { JustJoinAd } from './types'

const API_ENDPOINT_URL =
  'https://justjoin.it/api/candidate-api/offers?from=0&itemsCount=1000&categories=javascript&city=Warszawa&cityRadius=30&currency=pln&orderBy=descending&sortBy=salary&keywordType=any&isPromoted=true'

type JustJoinResponse = {
  data: JustJoinAd[]
}

export const fetchJustJoinAds = async (): Promise<JustJoinAd[]> => {
  const resp = await observeHttpFetch(API_ENDPOINT_URL, 'json', () =>
    fetchJSON<JustJoinResponse>(API_ENDPOINT_URL, { accept: 'application/json' }),
  )
  return resp.data
}
