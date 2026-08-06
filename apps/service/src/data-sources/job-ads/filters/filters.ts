import { JobAd, JobAdsFeedItem, JobApplyStatus } from '@repo/types'

export const isHybridOrRemote: (offer: JobAd) => boolean = offer =>
  offer.workplaceType === 'hybrid' || offer.workplaceType === 'remote'

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

const unwantedSkills = [
  /^python/i,
  /^vue/i,
  /^\.net/i,
  /^java$|^java /i,
  /^ruby/i,
  /^c#.*/i,
  /^kotlin/i,
  /^gatsby/i,
  /^adobe/i,
  /^golang/i,
  /^grails/i,
  /^elixir/i,
  /^sap/i,
  /^salesforce/i,
  /^angular/i,
]

export const noUwantedSkills: (ad: JobAd) => boolean = ({ requiredSkills }) => {
  return !requiredSkills.some(skillName => unwantedSkills.some(unwanted => unwanted.test(skillName)))
}

export const notManager: (ad: JobAd) => boolean = ({ title }) => {
  return !/\bmanager\b/i.test(title)
}

export const withReact: (ad: JobAd) => boolean = ({ requiredSkills }) => {
  return requiredSkills.includes('React')
}
