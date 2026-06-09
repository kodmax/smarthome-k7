import { JobAd } from '@repo/types'
import { NoFluffJobsAd } from './types'
import { isUnwantedCompany } from '../filters'
import { getMonthlySalaryAfterTax } from '../getMonthlySalaryAfterTax'

export const toJobAd = (ad: NoFluffJobsAd): JobAd => {
  return {
    id: ad.id,
    origin: 'nfj',
    title: ad.title,
    advertUrl: `https://nofluffjobs.com/pl/job/${ad.url}`,
    companyLogoUrl: ad.logo.original,
    companyName: ad.name,
    requiredSkills: ad.tiles.values.filter(item => item.type === 'requirement').map(item => item.value),
    workplaceType: ad.fullyRemote ? 'remote' : 'hybrid',
    employmentType: ad.salary.type === 'permanent' ? 'permanent' : 'b2b',
    isUnwantedCompany: isUnwantedCompany(ad.name),
    monthlySalaryRangeAfterTaxes:
      ad.salary.from !== undefined && ad.salary.to !== undefined
        ? getMonthlySalaryAfterTax(ad.salary.type, 'Month', ad.salary.from, ad.salary.to)
        : undefined,
  }
}
