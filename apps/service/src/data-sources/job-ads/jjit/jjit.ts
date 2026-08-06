import { JobAd } from '@repo/types'
import { fetchJustJoinAds } from './fetchJustJoinAds'
import { toJobAd } from './toJobAd'

const jjit = async (): Promise<JobAd[]> => {
  return (await fetchJustJoinAds()).map(toJobAd)
}

export { jjit, fetchJustJoinAds }
