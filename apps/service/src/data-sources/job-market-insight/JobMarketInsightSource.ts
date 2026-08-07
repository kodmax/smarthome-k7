import { CacheAgeUnit, DataSource } from '@repo/feeds'
import { JobMarketInsightCachedFeed, JobMarketInsightFeed } from '@repo/types'
import type { Sql } from '@repo/db'
import DateTime from '@/DateTime'
import { Inject } from '@/di'
import { loadJobAdsForMarketInsight } from '../job-ads/loadJobAdsForMarketInsight'
import { buildJobMarketInsightFeed } from './buildJobMarketInsightFeed'
import { loadJobMarketInsightSnapshotAtOrBefore } from './loadJobMarketInsightSnapshotAtOrBefore'
import { persistDailyJobMarketInsightSnapshot } from './persistDailyJobMarketInsightSnapshot'

const COMPARISON_WINDOW_DAYS = 1 // TODO: revert to 7 after verifying change metrics

export class JobMarketInsightSource extends DataSource<JobMarketInsightFeed, JobMarketInsightCachedFeed> {
  @Inject('db')
  declare private db: Sql

  static getId() {
    return 'job-market-insight'
  }

  static getCron() {
    return '5 * * * *'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 4
  }

  protected getSourceMetricType() {
    return 'db' as const
  }

  protected async fetchData() {
    const ads = await loadJobAdsForMarketInsight(this.db)
    const metrics = buildJobMarketInsightFeed(ads)

    await persistDailyJobMarketInsightSnapshot(this.db, metrics)

    return metrics
  }

  protected async composeContent(cached: JobMarketInsightCachedFeed): Promise<JobMarketInsightFeed> {
    const baselineAt = DateTime.shift(-COMPARISON_WINDOW_DAYS, DateTime.DAY).getDateTime()
    const previous = await loadJobMarketInsightSnapshotAtOrBefore(this.db, baselineAt)

    return {
      adsCount: { value: cached.adsCount, previous: previous?.adsCount ?? null },
      newOffersCount: { value: cached.newOffersCount, previous: previous?.newOffersCount ?? null },
      medianSalary: { value: cached.medianSalary, previous: previous?.medianSalary ?? null },
      p90Salary: { value: cached.p90Salary, previous: previous?.p90Salary ?? null },
      p90OffersCount: { value: cached.p90OffersCount, previous: previous?.p90OffersCount ?? null },
      offersWithSalaryRangePercent: {
        value: cached.offersWithSalaryRangePercent,
        previous: previous?.offersWithSalaryRangePercent ?? null,
      },
      remoteWorkPercent: { value: cached.remoteWorkPercent, previous: previous?.remoteWorkPercent ?? null },
      hybridWorkPercent: { value: cached.hybridWorkPercent, previous: previous?.hybridWorkPercent ?? null },
      officeWorkPercent: { value: cached.officeWorkPercent, previous: previous?.officeWorkPercent ?? null },
      permanentEmploymentPercent: {
        value: cached.permanentEmploymentPercent,
        previous: previous?.permanentEmploymentPercent ?? null,
      },
      popularTechnologies: cached.popularTechnologies,
      salaryDistribution: cached.salaryDistribution,
    }
  }
}
