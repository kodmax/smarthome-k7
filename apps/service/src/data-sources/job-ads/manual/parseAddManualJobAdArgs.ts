import { JobAdDocument, JobApplyStatus, WorkplaceType } from '@repo/types'
import { captureInvalidInput } from '@/sentry'
import { isJobApplyStatus } from '../applicationMeta'
import { createJobAdDocument, withApplicationStatusChangedAt } from '../jobAdDocument'
import { buildManualJobAdSalary } from './buildManualJobAdSalary'
import { digestManualId } from './digestManualId'
import { parseRequiredSkills } from './parseRequiredSkills'
import { parsePaidVacationDays } from './parsePaidVacationDays'

const MANUAL_APPLY_STATUSES = new Set<JobApplyStatus>(['pending-review', 'consider', 'applied', 'interview'])
const MANUAL_EMPLOYMENT_TYPES = new Set(['permanent', 'b2b'] as const)
const WORKPLACE_TYPES = new Set<WorkplaceType>(['office', 'remote', 'hybrid'])

export type AddManualJobAdCommandArgs = {
  title: string
  companyName: string
  advertUrl: string
  workplaceType: WorkplaceType
  employmentType: 'permanent' | 'b2b'
  salaryFrom?: number
  salaryTo?: number
  applyStatus: JobApplyStatus
  appliedAt?: string
  requiredSkills: string[]
  paidVacationDays?: number
}

function isManualEmploymentType(value: unknown): value is AddManualJobAdCommandArgs['employmentType'] {
  return typeof value === 'string' && MANUAL_EMPLOYMENT_TYPES.has(value as AddManualJobAdCommandArgs['employmentType'])
}

function isWorkplaceType(value: unknown): value is WorkplaceType {
  return typeof value === 'string' && WORKPLACE_TYPES.has(value as WorkplaceType)
}

function parseOptionalSalary(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined
  }

  return value
}

function parseOptionalAppliedAt(value: unknown): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (typeof value !== 'string') {
    return undefined
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed.toISOString()
}

function isValidAdvertUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function resolveAppliedAt(applyStatus: JobApplyStatus, appliedAt: string | undefined, now: Date): string | null {
  if (applyStatus !== 'applied' && applyStatus !== 'interview') {
    return null
  }

  return appliedAt ?? now.toISOString()
}

export function buildManualJobAdDocument(args: AddManualJobAdCommandArgs, now: Date = new Date()): JobAdDocument {
  const publishedAt = args.appliedAt ?? now.toISOString()
  const appliedAt = resolveAppliedAt(args.applyStatus, args.appliedAt, now)
  const document = createJobAdDocument({
    id: digestManualId(args.advertUrl),
    title: args.title.trim(),
    advertUrl: args.advertUrl.trim(),
    companyLogoUrl: '',
    companyName: args.companyName.trim(),
    requiredSkills: args.requiredSkills,
    workplaceType: args.workplaceType,
    employmentType: args.employmentType,
    monthlySalaryRangeAfterTaxes: buildManualJobAdSalary(
      args.employmentType,
      args.salaryFrom,
      args.salaryTo,
      args.paidVacationDays,
    ),
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

export function parseAddManualJobAdArgs(args: string): AddManualJobAdCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (typeof parsed.title !== 'string' || parsed.title.trim().length === 0) {
      captureInvalidInput('job-ads: invalid add-manual title', args)
      return null
    }

    if (typeof parsed.companyName !== 'string' || parsed.companyName.trim().length === 0) {
      captureInvalidInput('job-ads: invalid add-manual companyName', args)
      return null
    }

    if (typeof parsed.advertUrl !== 'string' || !isValidAdvertUrl(parsed.advertUrl.trim())) {
      captureInvalidInput('job-ads: invalid add-manual advertUrl', args)
      return null
    }

    if (!isWorkplaceType(parsed.workplaceType)) {
      captureInvalidInput('job-ads: invalid add-manual workplaceType', args)
      return null
    }

    if (!isManualEmploymentType(parsed.employmentType)) {
      captureInvalidInput('job-ads: invalid add-manual employmentType', args)
      return null
    }

    if (!isJobApplyStatus(parsed.applyStatus) || !MANUAL_APPLY_STATUSES.has(parsed.applyStatus)) {
      captureInvalidInput('job-ads: invalid add-manual applyStatus', args)
      return null
    }

    const salaryFrom = parseOptionalSalary(parsed.salaryFrom)
    const salaryTo = parseOptionalSalary(parsed.salaryTo)
    if (
      (parsed.salaryFrom !== undefined && parsed.salaryFrom !== null && salaryFrom === undefined) ||
      (parsed.salaryTo !== undefined && parsed.salaryTo !== null && salaryTo === undefined)
    ) {
      captureInvalidInput('job-ads: invalid add-manual salary', args)
      return null
    }

    if (salaryFrom !== undefined && salaryTo !== undefined && salaryFrom > salaryTo) {
      captureInvalidInput('job-ads: invalid add-manual salary range', args)
      return null
    }

    const appliedAt = parseOptionalAppliedAt(parsed.appliedAt)
    if (
      parsed.appliedAt !== undefined &&
      parsed.appliedAt !== null &&
      parsed.appliedAt !== '' &&
      appliedAt === undefined
    ) {
      captureInvalidInput('job-ads: invalid add-manual appliedAt', args)
      return null
    }

    const requiredSkills = parseRequiredSkills(parsed.requiredSkills)
    if (requiredSkills === null) {
      captureInvalidInput('job-ads: invalid add-manual requiredSkills', args)
      return null
    }

    const paidVacationDays = parsePaidVacationDays(parsed.paidVacationDays)
    if (paidVacationDays === null) {
      captureInvalidInput('job-ads: invalid add-manual paidVacationDays', args)
      return null
    }

    return {
      title: parsed.title,
      companyName: parsed.companyName,
      advertUrl: parsed.advertUrl,
      workplaceType: parsed.workplaceType,
      employmentType: parsed.employmentType,
      salaryFrom,
      salaryTo,
      applyStatus: parsed.applyStatus,
      appliedAt,
      requiredSkills,
      paidVacationDays,
    }
  } catch (cause) {
    captureInvalidInput('job-ads: failed to parse add-manual command args', cause)
    return null
  }
}
