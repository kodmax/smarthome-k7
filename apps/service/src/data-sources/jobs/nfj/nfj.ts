import { JobAd } from '@repo/types'
import { toJobAd } from './toJobAd'
import { getAllPostings } from './getAllPostings'
import { getHybridPostings } from './getHybridPostings'

const nfj: () => Promise<JobAd[]> = async () => {
  const hybridPostings = await getHybridPostings()
  const hybridIds = new Set<string>()
  for (const ad of hybridPostings) {
    hybridIds.add(ad.id)
  }

  const allPostings = await getAllPostings()
  return allPostings.map(ad => toJobAd(ad, hybridIds))
}

export { nfj }
