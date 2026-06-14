import { myFetch } from '../../../fetch'
import { JobAd } from '@repo/types'
import { toJobAd } from './toJobAd'

const API_ENDPOINT_URL =
  'https://justjoin.it/api/candidate-api/offers?from=0&itemsCount=1000&categories=javascript&city=Warszawa&cityRadius=30&currency=pln&orderBy=descending&sortBy=salary&keywordType=any&isPromoted=true'
const jjit = async (): Promise<JobAd[]> => {
  return myFetch(API_ENDPOINT_URL, { accept: 'application/json' })
    .then(resp => JSON.parse(resp.toString()).data)
    .then(jjAds => jjAds.map(toJobAd))
}

export { jjit }
