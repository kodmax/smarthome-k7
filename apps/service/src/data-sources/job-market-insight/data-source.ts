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
import { loadJobMarketInsightSnapshotAtOrBefore } from './loadJobMarketInsightSnapshotAtOrBefore'
import { persistDailyJobMarketInsightSnapshot } from './persistDailyJobMarketInsightSnapshot'

const COMPARISON_WINDOW_DAYS = 1 // TODO: revert to 7 after verifying change metrics

export class JobMarketInsightSource extends DataSourceDefinition<JobMarketInsightFeed, JobMarketInsightCachedFeed> {
  @Inject('db')
  declare private db: Pool

  getId() {
    return 'job-market-insight'
  }

  getCron() {
    return '0 * * * *'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR * 4
  }

  async getData() {
    const allAds = new Map<string, JobAd>()

    addAllAds(allAds, await jjit())
    addAllAds(allAds, await nfj())
    addAllAds(allAds, await theprotocol())

    const ads = [...allAds.values()]
    const metrics = buildJobMarketInsightFeed(ads)

    await persistDailyJobMarketInsightSnapshot(this.db, metrics)

    return metrics
  }

  async composeContent(cached: JobMarketInsightCachedFeed): Promise<JobMarketInsightFeed> {
    const baselineAt = DateTime.shift(-COMPARISON_WINDOW_DAYS, DateTime.DAY).getDateTime()
    const previous = await loadJobMarketInsightSnapshotAtOrBefore(this.db, baselineAt)

    return {
      adsCount: { value: cached.adsCount, previous: previous?.adsCount ?? null },
      newOffersCount: { value: cached.newOffersCount, previous: previous?.newOffersCount ?? null },
      medianSalary: { value: cached.medianSalary, previous: previous?.medianSalary ?? null },
      p90Salary: { value: cached.p90Salary, previous: previous?.p90Salary ?? null },
      offersWithSalaryRangePercent: {
        value: cached.offersWithSalaryRangePercent,
        previous: previous?.offersWithSalaryRangePercent ?? null,
      },
      remoteWorkPercent: { value: cached.remoteWorkPercent, previous: previous?.remoteWorkPercent ?? null },
      permanentEmploymentPercent: {
        value: cached.permanentEmploymentPercent,
        previous: previous?.permanentEmploymentPercent ?? null,
      },
      popularTechnologies: cached.popularTechnologies,
      salaryDistribution: cached.salaryDistribution,
    }
  }
}
