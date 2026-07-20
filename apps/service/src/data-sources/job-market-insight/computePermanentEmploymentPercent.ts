import { JobAd } from '@repo/types'

export const computePermanentEmploymentPercent = (ads: JobAd[]): number => {
  if (ads.length === 0) {
    return 0
  }

  const permanent = ads.filter(ad => ad.employmentType === 'permanent').length

  return Math.round((permanent / ads.length) * 100)
}
