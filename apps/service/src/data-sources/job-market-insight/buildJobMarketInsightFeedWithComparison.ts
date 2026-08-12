import { JobMarketInsightFeed, JobMarketInsightMetrics } from '@repo/types'
import { JobMarketInsightSnapshotMetrics } from './persistDailyJobMarketInsightSnapshot'

export const buildJobMarketInsightFeedWithComparison = (
  recent: JobMarketInsightSnapshotMetrics | null,
  previous: JobMarketInsightSnapshotMetrics | null,
  live: JobMarketInsightMetrics,
): JobMarketInsightFeed => ({
  adsCount: { value: live.adsCount, previous: null },
  newOffersCount: { value: recent?.newOffersCount ?? null, previous: previous?.newOffersCount ?? null },
  medianSalary: { value: recent?.medianSalary ?? null, previous: previous?.medianSalary ?? null },
  p90Salary: { value: recent?.p90Salary ?? null, previous: previous?.p90Salary ?? null },
  p90OffersCount: { value: recent?.p90OffersCount ?? null, previous: previous?.p90OffersCount ?? null },
  offersWithSalaryRangePercent: {
    value: recent?.offersWithSalaryRangePercent ?? null,
    previous: previous?.offersWithSalaryRangePercent ?? null,
  },
  remoteWorkPercent: { value: recent?.remoteWorkPercent ?? null, previous: previous?.remoteWorkPercent ?? null },
  hybridWorkPercent: { value: recent?.hybridWorkPercent ?? null, previous: previous?.hybridWorkPercent ?? null },
  officeWorkPercent: { value: recent?.officeWorkPercent ?? null, previous: previous?.officeWorkPercent ?? null },
  permanentEmploymentPercent: {
    value: recent?.permanentEmploymentPercent ?? null,
    previous: previous?.permanentEmploymentPercent ?? null,
  },
  popularTechnologies: live.popularTechnologies,
  salaryDistribution: live.salaryDistribution,
})
