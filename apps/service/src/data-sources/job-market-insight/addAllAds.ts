import { JobAd } from '@repo/types'

export const addAllAds = (allAds: Map<string, JobAd>, ads: JobAd[]): void => {
  for (const ad of ads) {
    const uid = `${ad.companyName.toLocaleLowerCase()} -- ${ad.title.toLocaleUpperCase()}`
    if (!allAds.has(uid)) {
      allAds.set(uid, ad)
    }
  }
}
