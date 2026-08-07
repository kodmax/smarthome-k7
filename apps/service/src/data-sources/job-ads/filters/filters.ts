import { JobAd, JobAdsFeedItem, JobApplyStatus } from '@repo/types'

const SALARY_FILTER_EXEMPT_STATUSES = new Set<JobApplyStatus>(['consider', 'applied', 'interview', 'archived'])

export const shouldFilterJobAdBySalary = (status: JobApplyStatus): boolean => !SALARY_FILTER_EXEMPT_STATUSES.has(status)

export const isSalaryAboveThreshold = (ad: JobAd, threshold: number): boolean =>
  ad.monthlySalaryRangeAfterTaxes !== undefined && ad.monthlySalaryRangeAfterTaxes.to > threshold

export const filterJobAdsByAcceptableSalary = (
  ads: JobAdsFeedItem[],
  acceptableSalary: number | null,
): JobAdsFeedItem[] => {
  if (acceptableSalary === null) {
    return ads
  }

  return ads.filter(item => {
    if (!shouldFilterJobAdBySalary(item.meta.application.status)) {
      return true
    }

    return isSalaryAboveThreshold(item.content, acceptableSalary)
  })
}
