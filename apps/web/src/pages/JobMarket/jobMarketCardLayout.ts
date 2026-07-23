import { apolloCardStackedColumnExtraHeight } from '@repo/apollo-card'

export const jobMarketGridRowGap = 12

export const jobMarketPopularHeight = 11
export const jobMarketSalaryHeight = 10
export const jobMarketJobsHeight = 24

export const jobMarketPopularExtraHeight = apolloCardStackedColumnExtraHeight({
  spanningRows: jobMarketPopularHeight,
  stackedRows: [jobMarketSalaryHeight, jobMarketJobsHeight],
  gridRowGap: jobMarketGridRowGap,
})

export const adsExtraHeight = apolloCardStackedColumnExtraHeight({
  spanningRows: jobMarketJobsHeight,
  stackedRows: [jobMarketSalaryHeight, jobMarketPopularHeight],
  gridRowGap: jobMarketGridRowGap,
})
