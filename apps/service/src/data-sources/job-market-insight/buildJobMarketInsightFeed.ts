import { JobAd, JobMarketInsightMetrics } from '@repo/types'
import { countNewOffers } from './countNewOffers'
import { computeMedianSalary } from './computeMedianSalary'
import { computePercent } from './computePercent'
import { computePopularTechnologies } from './computePopularTechnologies'
import { computeSalaryDistribution } from './computeSalaryDistribution'

export const buildJobMarketInsightFeed = (ads: JobAd[]): JobMarketInsightMetrics => ({
  adsCount: ads.length,
  newOffersCount: countNewOffers(ads),
  medianSalary: computeMedianSalary(ads),
  offersWithSalaryRangePercent: computePercent(ads, ad => ad.monthlySalaryRangeAfterTaxes !== undefined),
  remoteWorkPercent: computePercent(ads, ad => ad.workplaceType === 'remote' || ad.workplaceType === 'hybrid'),
  permanentEmploymentPercent: computePercent(ads, ad => ad.employmentType === 'permanent'),
  popularTechnologies: computePopularTechnologies(ads),
  salaryDistribution: computeSalaryDistribution(ads),
})
