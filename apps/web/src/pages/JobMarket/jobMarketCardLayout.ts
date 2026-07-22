import { apolloCardStackedColumnExtraHeight } from '@repo/apollo-card'

export const jobMarketGridRowGap = 12

export const jobMarketPopularHeight = 24
export const jobMarketSalaryHeight = 13
export const jobMarketJobsHeight = 8

export const jobMarketPopularExtraHeight = apolloCardStackedColumnExtraHeight({
  spanningRows: jobMarketPopularHeight,
  stackedRows: [jobMarketSalaryHeight, jobMarketJobsHeight],
  gridRowGap: jobMarketGridRowGap,
})
