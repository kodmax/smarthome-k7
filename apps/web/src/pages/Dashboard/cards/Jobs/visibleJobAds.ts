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

export function getDisplayedJobAds(
  ads: JobAdWithMeta[] | undefined,
  { editMode, showAllAds }: { editMode: boolean; showAllAds: boolean },
): JobAdWithMeta[] {
  const visibleAds = ads ? filterVisibleJobAds(ads) : []

  if (editMode && showAllAds) {
    return ads ?? []
  }

  return visibleAds
}
