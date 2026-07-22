import { JobAdWithMeta, JobApplyStatus } from '@repo/types'

const DASHBOARD_VISIBLE_APPLY_STATUSES = new Set<JobApplyStatus>(['not-applied', 'applied'])

export function isJobAdVisibleInNormalView(ad: Pick<JobAdWithMeta, 'meta'>): boolean {
  return DASHBOARD_VISIBLE_APPLY_STATUSES.has(ad.meta.application.status)
}

export function filterVisibleJobAds(ads: JobAdWithMeta[]): JobAdWithMeta[] {
  return ads.filter(isJobAdVisibleInNormalView)
}
