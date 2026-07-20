import { JobAd } from '@repo/types'

export const computePercent = (ads: JobAd[], predicate: (ad: JobAd) => boolean): number =>
  ads.length === 0 ? 0 : Math.round((ads.filter(predicate).length / ads.length) * 100)
