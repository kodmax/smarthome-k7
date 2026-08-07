import { WorkplaceType } from '@repo/types'
import { captureInvalidInput } from '@/sentry'
import { parseRequiredSkills } from './parseRequiredSkills'
import { parsePaidVacationDays } from './parsePaidVacationDays'

const MANUAL_EMPLOYMENT_TYPES = new Set(['permanent', 'b2b'] as const)
const WORKPLACE_TYPES = new Set<WorkplaceType>(['office', 'remote', 'hybrid'])

export type EditManualJobAdCommandArgs = {
  id: string
  workplaceType: WorkplaceType
  employmentType: 'permanent' | 'b2b'
  salaryFrom?: number
  salaryTo?: number
  requiredSkills: string[]
  paidVacationDays?: number
}

function isManualEmploymentType(value: unknown): value is EditManualJobAdCommandArgs['employmentType'] {
  return typeof value === 'string' && MANUAL_EMPLOYMENT_TYPES.has(value as EditManualJobAdCommandArgs['employmentType'])
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

function parseSalaryFields(
  parsed: Record<string, unknown>,
): Pick<EditManualJobAdCommandArgs, 'salaryFrom' | 'salaryTo'> | null {
  const salaryFrom = parseOptionalSalary(parsed.salaryFrom)
  const salaryTo = parseOptionalSalary(parsed.salaryTo)
  if (
    (parsed.salaryFrom !== undefined && parsed.salaryFrom !== null && salaryFrom === undefined) ||
    (parsed.salaryTo !== undefined && parsed.salaryTo !== null && salaryTo === undefined)
  ) {
    return null
  }

  if (salaryFrom !== undefined && salaryTo !== undefined && salaryFrom > salaryTo) {
    return null
  }

  return { salaryFrom, salaryTo }
}

export function parseEditManualJobAdArgs(args: string): EditManualJobAdCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (typeof parsed.id !== 'string' || parsed.id.trim().length === 0) {
      captureInvalidInput('job-ads: invalid edit-manual id', args)
      return null
    }

    if (!isWorkplaceType(parsed.workplaceType)) {
      captureInvalidInput('job-ads: invalid edit-manual workplaceType', args)
      return null
    }

    if (!isManualEmploymentType(parsed.employmentType)) {
      captureInvalidInput('job-ads: invalid edit-manual employmentType', args)
      return null
    }

    const salary = parseSalaryFields(parsed)
    if (salary === null) {
      captureInvalidInput('job-ads: invalid edit-manual salary', args)
      return null
    }

    const requiredSkills = parseRequiredSkills(parsed.requiredSkills)
    if (requiredSkills === null) {
      captureInvalidInput('job-ads: invalid edit-manual requiredSkills', args)
      return null
    }

    const paidVacationDays = parsePaidVacationDays(parsed.paidVacationDays)
    if (paidVacationDays === null) {
      captureInvalidInput('job-ads: invalid edit-manual paidVacationDays', args)
      return null
    }

    return {
      id: parsed.id.trim(),
      workplaceType: parsed.workplaceType,
      employmentType: parsed.employmentType,
      requiredSkills,
      paidVacationDays,
      ...salary,
    }
  } catch (cause) {
    captureInvalidInput('job-ads: failed to parse edit-manual command args', cause)
    return null
  }
}

export function parseDeleteManualJobAdArgs(args: string): string | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (typeof parsed.id !== 'string' || parsed.id.trim().length === 0) {
      captureInvalidInput('job-ads: invalid delete-manual id', args)
      return null
    }

    return parsed.id.trim()
  } catch (cause) {
    captureInvalidInput('job-ads: failed to parse delete-manual command args', cause)
    return null
  }
}
