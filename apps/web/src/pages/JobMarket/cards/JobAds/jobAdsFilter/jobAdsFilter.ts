import { JobAdsFeedItem, JobApplyStatus } from '@repo/types'

export const JOB_ADS_FILTER_ORDER = [
  'pending-review',
  'consider',
  'applied',
  'no-response',
  'interview',
  'archived',
] as const satisfies readonly JobApplyStatus[]

export type JobAdsFilter = JobApplyStatus

export const DEFAULT_JOB_ADS_FILTER: JobAdsFilter = 'pending-review'

export function filterJobAdsByCategory(ads: JobAdsFeedItem[], filter: JobAdsFilter): JobAdsFeedItem[] {
  return ads.filter(ad => ad.meta.application.status === filter)
}
