import { JobAd, JobMarketInsightFeed } from '@repo/types'
import { countNewOffers } from './countNewOffers'
import { computeMedianSalary } from './computeMedianSalary'
import { computeOffersWithSalaryRangePercent } from './computeOffersWithSalaryRangePercent'
import { computePermanentEmploymentPercent } from './computePermanentEmploymentPercent'
import { computePopularTechnologies } from './computePopularTechnologies'
import { computeRemoteWorkPercent } from './computeRemoteWorkPercent'
import { computeSalaryDistribution } from './computeSalaryDistribution'

export const buildJobMarketInsightFeed = (ads: JobAd[]): JobMarketInsightFeed => ({
  adsCount: ads.length,
  newOffersCount: countNewOffers(ads),
  medianSalary: computeMedianSalary(ads),
  offersWithSalaryRangePercent: computeOffersWithSalaryRangePercent(ads),
  remoteWorkPercent: computeRemoteWorkPercent(ads),
  permanentEmploymentPercent: computePermanentEmploymentPercent(ads),
  popularTechnologies: computePopularTechnologies(ads),
  salaryDistribution: computeSalaryDistribution(ads),
})
