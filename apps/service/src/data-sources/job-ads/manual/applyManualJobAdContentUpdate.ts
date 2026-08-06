import { JobAdDocument } from '@repo/types'
import { buildManualJobAdSalary } from './buildManualJobAdSalary'
import type { EditManualJobAdCommandArgs } from './parseEditManualJobAdArgs'

export function applyManualJobAdContentUpdate(
  existing: JobAdDocument,
  args: EditManualJobAdCommandArgs,
): JobAdDocument {
  return {
    ...existing,
    content: {
      ...existing.content,
      workplaceType: args.workplaceType,
      employmentType: args.employmentType,
      monthlySalaryRangeAfterTaxes: buildManualJobAdSalary(args.employmentType, args.salaryFrom, args.salaryTo),
    },
  }
}

export function isManualJobAdDocument(document: JobAdDocument): boolean {
  return document.content.origin === 'manual'
}
