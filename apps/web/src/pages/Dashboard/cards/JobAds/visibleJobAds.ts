import { JobAdsFeedItem, JobApplyStatus } from '@repo/types'

const DASHBOARD_VISIBLE_APPLY_STATUSES = new Set<JobApplyStatus>([
  'not-applied',
  'consider',
  'applied',
  'interview',
  'offer',
])

export function isJobAdVisibleInNormalView(ad: Pick<JobAdsFeedItem, 'meta'>): boolean {
  return DASHBOARD_VISIBLE_APPLY_STATUSES.has(ad.meta.application.status)
}

export function filterVisibleJobAds(ads: JobAdsFeedItem[]): JobAdsFeedItem[] {
  return ads.filter(isJobAdVisibleInNormalView)
}
