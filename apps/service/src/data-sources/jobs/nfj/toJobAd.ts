import { JobAd } from '@repo/types'
import { NoFluffJobsAd } from './types'
import { getMonthlySalaryAfterTax } from '../getMonthlySalaryAfterTax'
import { sanitizeMonthlySalaryRange } from '../sanitizeMonthlySalary'
import { digestNfjId } from './digestNfjId'

export const toJobAd = (ad: NoFluffJobsAd, hybridIds: Set<string>): JobAd => {
  return {
    id: digestNfjId(ad.url),
    origin: 'nfj',
    title: ad.title,
    advertUrl: `https://nofluffjobs.com/pl/job/${ad.url}`,
    companyLogoUrl: `https://static.nofluffjobs.com/${ad.logo.original}`,
    companyName: ad.name,
    requiredSkills: ad.tiles.values.filter(item => item.type === 'requirement').map(item => item.value),
    workplaceType: hybridIds.has(ad.id) ? 'hybrid' : ad.location.fullyRemote ? 'remote' : 'office',
    employmentType: ad.salary.type,
    monthlySalaryRangeAfterTaxes:
      ad.salary.from !== undefined && ad.salary.to !== undefined
        ? sanitizeMonthlySalaryRange(getMonthlySalaryAfterTax(ad.salary.type, 'Month', ad.salary.from, ad.salary.to))
        : undefined,
    publishedAt: new Date(ad.posted).toISOString(),
  }
}
