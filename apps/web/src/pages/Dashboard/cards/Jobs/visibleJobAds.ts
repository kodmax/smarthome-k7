import { JobAdWithMeta, isTerminalApplyStatus } from '@repo/types'

export function isJobAdVisibleInNormalView(ad: Pick<JobAdWithMeta, 'meta'>): boolean {
  const status = ad.meta.application.status

  if (status === 'not-interested') {
    return false
  }

  return !isTerminalApplyStatus(status)
}

export function filterVisibleJobAds(ads: JobAdWithMeta[]): JobAdWithMeta[] {
  return ads.filter(isJobAdVisibleInNormalView)
}
