import { getJSON } from '@/fetch'
import { JobAd } from '@repo/types'
import { toJobAd } from './toJobAd'
import { JustJoinAd } from './types'

const API_ENDPOINT_URL =
  'https://justjoin.it/api/candidate-api/offers?from=0&itemsCount=1000&categories=javascript&city=Warszawa&cityRadius=30&currency=pln&orderBy=descending&sortBy=salary&keywordType=any&isPromoted=true'

type JustJoinResponse = {
  data: JustJoinAd[]
}

const jjit = async (): Promise<JobAd[]> => {
  return getJSON<JustJoinResponse>(API_ENDPOINT_URL, { accept: 'application/json' }).then(resp =>
    resp.data.map(toJobAd),
  )
}

export { jjit }
