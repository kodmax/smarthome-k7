import { getAllPostings } from './getAllPostings'
import { getHybridPostings } from './getHybridPostings'
import { NoFluffJobsAd } from './types'

const fetchNfjListing = async (): Promise<{ postings: NoFluffJobsAd[]; hybridIds: Set<string> }> => {
  const hybridPostings = await getHybridPostings()
  const hybridIds = new Set<string>()
  for (const ad of hybridPostings) {
    hybridIds.add(ad.id)
  }

  const postings = await getAllPostings()
  return { postings, hybridIds }
}

export { fetchNfjListing }
