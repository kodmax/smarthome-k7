import { JobAdDocument } from '@repo/types'
import { buildManualJobAdSalary } from './buildManualJobAdSalary'
import type { EditManualJobAdCommandArgs } from './parseEditManualJobAdArgs'

export function applyManualJobAdContentUpdate(
  existing: JobAdDocument,
  args: EditManualJobAdCommandArgs,
): JobAdDocument {
  const paidVacationDays = args.employmentType === 'b2b' ? args.paidVacationDays : undefined

  return {
    ...existing,
    content: {
      ...existing.content,
      workplaceType: args.workplaceType,
      employmentType: args.employmentType,
      monthlySalaryRangeAfterTaxes: buildManualJobAdSalary(
        args.employmentType,
        args.salaryFrom,
        args.salaryTo,
        paidVacationDays,
      ),
      paidVacationDays,
      requiredSkills: args.requiredSkills,
    },
  }
}

export function isManualJobAdDocument(document: JobAdDocument): boolean {
  return document.content.origin === 'manual'
}
