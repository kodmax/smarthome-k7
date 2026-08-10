import { JobAdDocument, JobApplyStatus, type JobAdsAddManualPayload } from '@repo/types'
import { createJobAdDocument, withApplicationStatusChangedAt } from '../jobAdDocument'
import { buildManualJobAdSalary } from './buildManualJobAdSalary'
import { digestManualId } from './digestManualId'

function resolveAppliedAt(applyStatus: JobApplyStatus, appliedAt: string | undefined, now: Date): string | null {
  if (applyStatus !== 'applied' && applyStatus !== 'interview') {
    return null
  }

  return appliedAt ?? now.toISOString()
}

export function buildManualJobAdDocument(args: JobAdsAddManualPayload, now: Date = new Date()): JobAdDocument {
  const publishedAt = args.appliedAt ?? now.toISOString()
  const appliedAt = resolveAppliedAt(args.applyStatus, args.appliedAt, now)
  const monthlySalaryRangeAfterTaxes = buildManualJobAdSalary(
    args.employmentType,
    args.salaryFrom,
    args.salaryTo,
    args.paidVacationDays,
  )
  const document = createJobAdDocument({
    id: digestManualId(args.advertUrl),
    title: args.title.trim(),
    advertUrl: args.advertUrl.trim(),
    companyLogoUrl: '',
    companyName: args.companyName.trim(),
    requiredSkills: args.requiredSkills,
    workplaceType: args.workplaceType,
    employmentType: args.employmentType,
    monthlySalaryRangeAfterTaxes,
    paidVacationDays: args.employmentType === 'b2b' ? args.paidVacationDays : undefined,
    origin: 'manual',
    publishedAt,
  })

  document.meta.firstPublishedAt = publishedAt
  document.meta.application = withApplicationStatusChangedAt(
    {
      applyStatus: args.applyStatus,
      archiveReason: null,
      comment: null,
      appliedAt,
      rejectedAt: null,
      statusChangedAt: null,
    },
    now,
  )

  return document
}
