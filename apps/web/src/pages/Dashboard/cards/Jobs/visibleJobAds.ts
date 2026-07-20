import { JobAdWithMeta, isHiddenApplyStatus } from '@repo/types'
import { type JobAdsFilter, filterJobAdsByCategory } from './jobAdsFilter'

export function isJobAdVisibleInNormalView(ad: Pick<JobAdWithMeta, 'meta'>): boolean {
  return !isHiddenApplyStatus(ad.meta.application.status)
}

export function filterVisibleJobAds(ads: JobAdWithMeta[]): JobAdWithMeta[] {
  return ads.filter(isJobAdVisibleInNormalView)
}

export function getDisplayedJobAds(
  ads: JobAdWithMeta[] | undefined,
  { editMode, filter }: { editMode: boolean; filter: JobAdsFilter },
): JobAdWithMeta[] {
  if (!ads) {
    return []
  }

  if (editMode) {
    return filterJobAdsByCategory(ads, filter)
  }

  return filterVisibleJobAds(ads)
}
