import { JobAd } from '@repo/types'
import { isHybridOrRemote, isSalaryAcceptable, notManager } from './filters'

export const addAds = (allAds: Map<string, JobAd>, ads: JobAd[]): void => {
  const filteredAds = ads.filter(isSalaryAcceptable).filter(isHybridOrRemote).filter(notManager)

  for (const ad of filteredAds) {
    const uid = `${ad.companyName.toLocaleLowerCase()} -- ${ad.title.toLocaleUpperCase()}`
    if (!allAds.has(uid)) {
      allAds.set(uid, ad)
    }
  }
}
