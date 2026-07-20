import { JobAdWithMeta, isHiddenApplyStatus } from '@repo/types'

export function isJobAdVisibleInNormalView(ad: Pick<JobAdWithMeta, 'meta'>): boolean {
  return !isHiddenApplyStatus(ad.meta.application.status)
}

export function filterVisibleJobAds(ads: JobAdWithMeta[]): JobAdWithMeta[] {
  return ads.filter(isJobAdVisibleInNormalView)
}

export function filterHiddenJobAds(ads: JobAdWithMeta[]): JobAdWithMeta[] {
  return ads.filter(ad => !isJobAdVisibleInNormalView(ad))
}

export function getDisplayedJobAds(
  ads: JobAdWithMeta[] | undefined,
  { editMode, showHiddenAds }: { editMode: boolean; showHiddenAds: boolean },
): JobAdWithMeta[] {
  if (!ads) {
    return []
  }

  if (editMode && showHiddenAds) {
    return filterHiddenJobAds(ads)
  }

  return filterVisibleJobAds(ads)
}
