import { JobAd } from '@repo/types'
import { JustJoinAd } from './types'
import { getMonthlySalaryAfterTax } from '../getMonthlySalaryAfterTax'
import { createHash } from 'node:crypto'

export const toJobAd = (jjAd: JustJoinAd): JobAd => {
  const jjEmploymentType = jjAd.employmentTypes.find(item => item.currency === 'PLN')

  return {
    id: createHash('sha256').update(jjAd.slug).digest('hex'),
    origin: 'jj',
    title: jjAd.title,
    advertUrl: `https://justjoin.it/job-offer/${jjAd.slug}`,
    companyLogoUrl: jjAd.companyLogoThumbUrl,
    companyName: jjAd.companyName,
    requiredSkills: jjAd.requiredSkills.filter(item => item.level >= 3).map(item => item.name),
    workplaceType: jjAd.workplaceType,
    employmentType: jjEmploymentType?.type === 'permanent' ? 'permanent' : 'b2b',
    monthlySalaryRangeAfterTaxes:
      jjEmploymentType !== undefined && jjEmploymentType.fromPerUnit !== null && jjEmploymentType.toPerUnit !== null
        ? getMonthlySalaryAfterTax(
            jjEmploymentType.type === 'permanent' ? 'permanent' : 'b2b',
            jjEmploymentType.unit,
            jjEmploymentType.fromPerUnit,
            jjEmploymentType.toPerUnit,
          )
        : undefined,
    publishedAt: jjAd.lastPublishedAt,
  }
}
