import { JobAdWithMeta, JobApplyStatus, isTerminalApplyStatus } from '@repo/types'

export const JOB_ADS_FILTER_ORDER = ['new', 'in-progress', 'not-interested', 'finished'] as const

export type JobAdsFilter = (typeof JOB_ADS_FILTER_ORDER)[number]

export const DEFAULT_JOB_ADS_FILTER: JobAdsFilter = 'new'

export function getJobAdFilterCategory(status: JobApplyStatus): JobAdsFilter {
  if (status === 'not-applied') {
    return 'new'
  }

  if (status === 'not-interested') {
    return 'not-interested'
  }

  if (isTerminalApplyStatus(status)) {
    return 'finished'
  }

  return 'in-progress'
}

export function filterJobAdsByCategory(ads: JobAdWithMeta[], filter: JobAdsFilter): JobAdWithMeta[] {
  return ads.filter(ad => getJobAdFilterCategory(ad.meta.application.status) === filter)
}
