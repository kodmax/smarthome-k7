import { JobAdDocument, type JobAdsEditManualPayload } from '@repo/types'
import { buildManualJobAdSalary } from './buildManualJobAdSalary'

export function applyManualJobAdContentUpdate(existing: JobAdDocument, args: JobAdsEditManualPayload): JobAdDocument {
  const paidVacationDays = args.employmentType === 'b2b' ? args.paidVacationDays : undefined
  const monthlySalaryRangeAfterTaxes = buildManualJobAdSalary(
    args.employmentType,
    args.salaryFrom,
    args.salaryTo,
    paidVacationDays,
  )

  return {
    ...existing,
    content: {
      ...existing.content,
      workplaceType: args.workplaceType,
      employmentType: args.employmentType,
      monthlySalaryRangeAfterTaxes,
      paidVacationDays,
      requiredSkills: args.requiredSkills,
    },
  }
}

export function isManualJobAdDocument(document: JobAdDocument): boolean {
  return document.content.origin === 'manual'
}
