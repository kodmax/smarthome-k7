import type { Sql } from '@repo/db'
import { JobAd } from '@repo/types'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { parseJobAdDocument } from './jobAdDocument'

export const MARKET_INSIGHT_ACTIVE_LISTING_HOURS = 3

type JobAdRow = {
  id: string
  data: unknown
}

export async function loadJobAdsForMarketInsight(db: Sql): Promise<JobAd[]> {
  const rows = await observeDbQuery(
    'select',
    'job_ads',
    () =>
      db<JobAdRow[]>`
      select id, data
      from job_ads
      where data->'content'->>'origin' = 'manual'
         or last_seen >= now() - ${`${MARKET_INSIGHT_ACTIVE_LISTING_HOURS} hours`}::interval
    `,
  )

  const ads: JobAd[] = []
  for (const row of rows) {
    const parsed = parseJobAdDocument(row.data)
    if (parsed !== null) {
      ads.push(parsed.content)
    }
  }

  return ads
}
