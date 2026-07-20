import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { JobAd, JobMarketInsightCachedFeed, JobMarketInsightFeed } from '@repo/types'
import type { Pool } from 'mariadb'
import DateTime from '@/DateTime'
import { Inject } from '@/di'
import { jjit } from '../jobs/jjit/jjit'
import { nfj } from '../jobs/nfj/nfj'
import { theprotocol } from '../jobs/theprotocol'
import { addAllAds } from './addAllAds'
import { buildJobMarketInsightFeed } from './buildJobMarketInsightFeed'
import { persistJobMarketInsightSnapshot } from './persistJobMarketInsightSnapshot'

export class JobMarketInsightSource extends DataSourceDefinition<JobMarketInsightFeed, JobMarketInsightCachedFeed> {
  @Inject('db')
  declare private db: Pool

  getId() {
    return 'job-market-insight'
  }

  getCron() {
    return '0 8 * * *'
  }

  isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }) {
    return snapshot.age(CacheAgeUnit.MINUTES) > 15
  }

  async getData() {
    const allAds = new Map<string, JobAd>()

    addAllAds(allAds, await jjit())
    addAllAds(allAds, await nfj())
    addAllAds(allAds, await theprotocol())

    const ads = [...allAds.values()]
    const metrics = buildJobMarketInsightFeed(ads)
    const snapshotAt = DateTime.now().getDateTime()

    await persistJobMarketInsightSnapshot(this.db, snapshotAt, metrics)

    return metrics
  }

  async composeContent(cached: JobMarketInsightCachedFeed): Promise<JobMarketInsightFeed> {
    return cached
  }
}
