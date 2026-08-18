import { JobAd } from '@repo/types'
import { parseCompensation } from './compensation'
import { digestWellfoundId } from './digestWellfoundId'
import type { WellfoundListing } from './types'

export const toJobAd = (listing: WellfoundListing): JobAd | null => {
  const parsed = parseCompensation(listing.job.compensation)
  if (!parsed.ok) {
    return null
  }

  const liveStartAt = listing.job.liveStartAt
  if (liveStartAt == null || !Number.isFinite(liveStartAt)) {
    return null
  }

  const { from, to, currency } = parsed.value

  return {
    id: digestWellfoundId(listing.job.id),
    title: listing.job.title,
    advertUrl: `https://wellfound.com/jobs/${listing.job.id}-${listing.job.slug}`,
    companyLogoUrl: listing.companyLogoUrl,
    companyName: listing.companyName,
    requiredSkills: [],
    workplaceType: 'remote',
    employmentType: 'b2b',
    originalSalary: {
      from,
      to,
      period: 'Year',
      currency,
    },
    origin: 'wellfound',
    publishedAt: new Date(liveStartAt * 1_000).toISOString(),
  }
}
