import { isJobAdApplied, JobAdsFeedItem } from '@repo/types'

export function filterJobAdsByAppliedAt(ads: JobAdsFeedItem[], onlyApplied: boolean): JobAdsFeedItem[] {
  if (!onlyApplied) {
    return ads
  }

  return ads.filter(isJobAdApplied)
}
