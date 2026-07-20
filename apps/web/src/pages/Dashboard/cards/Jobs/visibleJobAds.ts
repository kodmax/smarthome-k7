import { JobAdWithMeta, isHiddenApplyStatus } from '@repo/types'

export function isJobAdVisibleInNormalView(ad: Pick<JobAdWithMeta, 'meta'>): boolean {
  return !isHiddenApplyStatus(ad.meta.application.status)
}

export function filterVisibleJobAds(ads: JobAdWithMeta[]): JobAdWithMeta[] {
  return ads.filter(isJobAdVisibleInNormalView)
}
