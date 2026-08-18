import type { JobListingSearchResult } from './types'

const SECONDS_PER_DAY = 86_400
export const MAX_AGE_DAYS = 30

export function isEverywhere(job: JobListingSearchResult): boolean {
  return (
    job.remote === true && job.remoteConfig?.kind === 'REMOTE' && (job.acceptedRemoteLocationNames?.length ?? 0) === 0
  )
}

export function isRecentEnough(job: JobListingSearchResult, maxAgeDays = MAX_AGE_DAYS): boolean {
  const liveStartAt = job.liveStartAt
  if (liveStartAt == null || !Number.isFinite(liveStartAt)) {
    return false
  }

  const ageSeconds = Date.now() / 1_000 - liveStartAt
  return ageSeconds <= maxAgeDays * SECONDS_PER_DAY
}
