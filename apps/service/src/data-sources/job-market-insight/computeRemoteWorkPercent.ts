import { JobAd } from '@repo/types'

export const computeRemoteWorkPercent = (ads: JobAd[]): number => {
  if (ads.length === 0) {
    return 0
  }

  const remoteOrHybrid = ads.filter(ad => ad.workplaceType === 'remote' || ad.workplaceType === 'hybrid').length

  return Math.round((remoteOrHybrid / ads.length) * 100)
}
