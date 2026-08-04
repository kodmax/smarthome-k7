import { JobAdArchiveReason, JobAdsFeedItem } from '@repo/types'

export const JOB_AD_ARCHIVE_REASON_ORDER = [
  'not-interested',
  'unmet-requirements',
  'stack-mismatch',
  'no-response',
  'rejected',
  'withdrawn',
  'offer-accepted',
  'weak-match',
] as const satisfies readonly JobAdArchiveReason[]

export type ArchivedJobAdsGroup = {
  archiveReason: JobAdArchiveReason
  ads: JobAdsFeedItem[]
}

export function groupArchivedJobAdsByReason(ads: JobAdsFeedItem[]): ArchivedJobAdsGroup[] {
  const adsByReason = new Map<JobAdArchiveReason, JobAdsFeedItem[]>()

  for (const ad of ads) {
    const archiveReason = ad.meta.application.archiveReason
    if (archiveReason === null) {
      continue
    }

    const group = adsByReason.get(archiveReason) ?? []
    group.push(ad)
    adsByReason.set(archiveReason, group)
  }

  return JOB_AD_ARCHIVE_REASON_ORDER.flatMap(archiveReason => {
    const groupAds = adsByReason.get(archiveReason)
    if (groupAds === undefined || groupAds.length === 0) {
      return []
    }

    return [{ archiveReason, ads: groupAds }]
  })
}
