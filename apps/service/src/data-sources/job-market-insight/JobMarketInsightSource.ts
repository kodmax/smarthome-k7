import { CacheAgeUnit, DataSource } from '@repo/feeds'
import { JobMarketInsightCachedFeed, JobMarketInsightFeed } from '@repo/types'
import type { Sql } from '@repo/db'
import DateTime from '@/DateTime'
import { Inject } from '@/di'
import { loadJobAdsForMarketInsight } from '../job-ads/loadJobAdsForMarketInsight'
import { filterJobAdsByNotInterestedSkills } from '../job-ads/filters'
import { loadNotInterestedSkillIds } from '../my-skills/loadNotInterestedSkillIds'
import { averageJobMarketInsightSnapshotMetrics } from './averageJobMarketInsightSnapshotMetrics'
import { buildJobMarketInsightFeed } from './buildJobMarketInsightFeed'
import { buildJobMarketInsightFeedWithComparison } from './buildJobMarketInsightFeedWithComparison'
import { COMPARISON_WINDOW_DAYS } from './comparisonWindowDays'
import { loadJobMarketInsightSnapshotsInRange } from './loadJobMarketInsightSnapshotsInRange'
import { persistDailyJobMarketInsightSnapshot } from './persistDailyJobMarketInsightSnapshot'

export class JobMarketInsightSource extends DataSource<JobMarketInsightFeed, JobMarketInsightCachedFeed> {
  @Inject('db')
  declare private db: Sql

  static getId() {
    return 'job-market-insight'
  }

  static getCron() {
    return '5 18 * * *'
  }

  static getCronPolicy() {
    return {
      retry: { maxAttempts: 3, delaySec: 5 * 60 },
      misfirePolicy: 'run-latest' as const,
    }
  }

  static getCacheTTL() {
    return CacheAgeUnit.DAY
  }

  protected getSourceMetricType() {
    return 'db' as const
  }

  protected async fetchData(): Promise<JobMarketInsightCachedFeed> {
    const [rawAds, notInterestedSkillIds] = await Promise.all([
      loadJobAdsForMarketInsight(this.db),
      loadNotInterestedSkillIds(this.db),
    ])
    const ads = filterJobAdsByNotInterestedSkills(rawAds, notInterestedSkillIds)
    const live = buildJobMarketInsightFeed(ads)

    await persistDailyJobMarketInsightSnapshot(this.db, live)

    const today = DateTime.now().getDate()
    const recentFrom = DateTime.shift(-(COMPARISON_WINDOW_DAYS - 1), DateTime.DAY).getDate()
    const previousTo = DateTime.shift(-COMPARISON_WINDOW_DAYS, DateTime.DAY).getDate()
    const previousFrom = DateTime.shift(-(COMPARISON_WINDOW_DAYS * 2 - 1), DateTime.DAY).getDate()

    const [recentSnapshots, previousSnapshots] = await Promise.all([
      loadJobMarketInsightSnapshotsInRange(this.db, recentFrom, today),
      loadJobMarketInsightSnapshotsInRange(this.db, previousFrom, previousTo),
    ])

    return buildJobMarketInsightFeedWithComparison(
      averageJobMarketInsightSnapshotMetrics(recentSnapshots),
      averageJobMarketInsightSnapshotMetrics(previousSnapshots),
      live,
    )
  }
}
