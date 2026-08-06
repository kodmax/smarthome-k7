import type { Pool } from 'mariadb'
import { JobAdsCachedFeed } from '@repo/types'
import { fetchJustJoinAds } from './jjit/fetchJustJoinAds'
import { digestJjitId } from './jjit/digestJjitId'
import { toJobAd as toJjitJobAd } from './jjit/toJobAd'
import { fetchNfjListing } from './nfj/nfj'
import { digestNfjId } from './nfj/digestNfjId'
import { toJobAd as toNfjJobAd } from './nfj/toJobAd'
import { fetchTheprotocolOffers } from './theprotocol/theprotocol'
import { digestTheprotocolId } from './theprotocol/digestTheprotocolId'
import { toJobAd as toTheprotocolJobAd } from './theprotocol/toJobAd'
import { createJobAdDocument } from './jobAdDocument'
import { batchInsertJobAds, batchUpdateLastSeen, loadExistingJobAdIds } from './jobAdsRepository'

type SyncListingEntry = {
  id: string
  insertDocument: () => ReturnType<typeof createJobAdDocument>
}

async function collectListingEntries(): Promise<SyncListingEntry[]> {
  const entries: SyncListingEntry[] = []

  for (const ad of await fetchJustJoinAds()) {
    entries.push({
      id: digestJjitId(ad.slug),
      insertDocument: () => createJobAdDocument(toJjitJobAd(ad)),
    })
  }

  const { postings, hybridIds } = await fetchNfjListing()
  for (const ad of postings) {
    entries.push({
      id: digestNfjId(ad.url),
      insertDocument: () => createJobAdDocument(toNfjJobAd(ad, hybridIds)),
    })
  }

  for (const ad of await fetchTheprotocolOffers()) {
    const jobAd = toTheprotocolJobAd(ad)
    if (jobAd === null) {
      continue
    }

    entries.push({
      id: digestTheprotocolId(ad.offerUrlName),
      insertDocument: () => createJobAdDocument(jobAd),
    })
  }

  return entries
}

export async function syncJobAdsFromSources(db: Pool): Promise<JobAdsCachedFeed> {
  const listingEntries = await collectListingEntries()
  const listingIds = listingEntries.map(entry => entry.id)

  if (listingIds.length === 0) {
    return { listingIds: [] }
  }

  const existingIds = await loadExistingJobAdIds(db, listingIds)
  const existingListingIds = listingIds.filter(id => existingIds.has(id))
  const newEntries = listingEntries.filter(entry => !existingIds.has(entry.id))

  if (existingListingIds.length > 0) {
    await batchUpdateLastSeen(db, existingListingIds)
  }

  if (newEntries.length > 0) {
    await batchInsertJobAds(
      db,
      newEntries.map(entry => ({ id: entry.id, document: entry.insertDocument() })),
    )
  }

  return { listingIds }
}
