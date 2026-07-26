import { JobAdsFeedItem, JobApplyStatus, isTerminalApplyStatus } from '@repo/types'

export const JOB_ADS_FILTER_ORDER = [
  'latest',
  'with-match-analysis',
  'in-progress',
  'rejected-no-response',
  'not-interested',
  'stretch',
  'finished',
] as const

export type JobAdsFilter = (typeof JOB_ADS_FILTER_ORDER)[number]

export const DEFAULT_JOB_ADS_FILTER: JobAdsFilter = 'latest'

export function getJobAdFilterCategory(status: JobApplyStatus): JobAdsFilter {
  if (status === 'not-applied') {
    return 'latest'
  }

  if (status === 'not-interested') {
    return 'not-interested'
  }

  if (status === 'unmet-requirements') {
    return 'stretch'
  }

  if (status === 'rejected' || status === 'no-response') {
    return 'rejected-no-response'
  }

  if (isTerminalApplyStatus(status)) {
    return 'finished'
  }

  return 'in-progress'
}

export function filterJobAdsByCategory(ads: JobAdsFeedItem[], filter: JobAdsFilter): JobAdsFeedItem[] {
  if (filter === 'with-match-analysis') {
    return ads
      .filter(ad => ad.matchAnalysis !== null && getJobAdFilterCategory(ad.meta.application.status) !== 'finished')
      .sort((left, right) => (right.matchAnalysis?.score ?? 0) - (left.matchAnalysis?.score ?? 0))
  }

  return ads.filter(ad => getJobAdFilterCategory(ad.meta.application.status) === filter)
}
