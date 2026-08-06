import { JobAd } from '@repo/types'
import { getAds } from './getAds'
import { toJobAd } from './toJobAd'

const theprotocol: () => Promise<JobAd[]> = async () => {
  const theProtocolAds = await getAds()
  const ads: JobAd[] = []

  for (const ad of theProtocolAds.filter(ad => ad)) {
    const jobAd = toJobAd(ad)
    if (jobAd !== null) {
      ads.push(jobAd)
    }
  }

  return ads
}

export { theprotocol, getAds as fetchTheprotocolOffers }
