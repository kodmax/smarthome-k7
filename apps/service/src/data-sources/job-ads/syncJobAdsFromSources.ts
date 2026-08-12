import type { Sql } from '@repo/db'
import { JobAdsCachedFeed } from '@repo/types'
import { fetchJustJoinAds } from './jjit/jjit'
import { digestJjitId } from './jjit/digestJjitId'
import { toJobAd as toJjitJobAd } from './jjit/toJobAd'
import { fetchNfjListing } from './nfj/nfj'
import { digestNfjId } from './nfj/digestNfjId'
import { toJobAd as toNfjJobAd } from './nfj/toJobAd'
import { fetchTheprotocolOffers } from './theprotocol/theprotocol'
import { digestTheprotocolId } from './theprotocol/digestTheprotocolId'
import { toJobAd as toTheprotocolJobAd } from './theprotocol/toJobAd'
import { createJobAdDocument } from './jobAdDocument'
import { buildJobAdDedupKey } from './filters/jobAdDedupKey'
import { batchInsertJobAds, batchUpdateLastSeen, loadExistingJobAdIds, loadJobAdDedupKeys } from './jobAdsRepository'

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

export async function syncJobAdsFromSources(db: Sql): Promise<JobAdsCachedFeed> {
  const listingEntries = await collectListingEntries()

  if (listingEntries.length === 0) {
    return { listingIds: [] }
  }

  const scrapedIds = listingEntries.map(entry => entry.id)
  const [existingIds, dedupKeyToId] = await Promise.all([loadExistingJobAdIds(db, scrapedIds), loadJobAdDedupKeys(db)])

  const canonicalListingIds: string[] = []
  const lastSeenIds = new Set<string>()
  const toInsert: Array<{ id: string; document: ReturnType<typeof createJobAdDocument> }> = []
  const batchDedupKeyToId = new Map<string, string>()

  for (const entry of listingEntries) {
    if (existingIds.has(entry.id)) {
      canonicalListingIds.push(entry.id)
      lastSeenIds.add(entry.id)
      continue
    }

    const document = entry.insertDocument()
    const dedupKey = buildJobAdDedupKey(document.content.companyName, document.content.title)
    const existingCanonicalId = dedupKeyToId.get(dedupKey)
    if (existingCanonicalId !== undefined) {
      lastSeenIds.add(existingCanonicalId)
      continue
    }

    const batchCanonicalId = batchDedupKeyToId.get(dedupKey)
    if (batchCanonicalId !== undefined) {
      lastSeenIds.add(batchCanonicalId)
      continue
    }

    toInsert.push({ id: entry.id, document })
    batchDedupKeyToId.set(dedupKey, entry.id)
    dedupKeyToId.set(dedupKey, entry.id)
    canonicalListingIds.push(entry.id)
    continue
  }

  if (lastSeenIds.size > 0) {
    await batchUpdateLastSeen(db, [...lastSeenIds])
  }

  if (toInsert.length > 0) {
    await batchInsertJobAds(db, toInsert)
  }

  return { listingIds: canonicalListingIds }
}
