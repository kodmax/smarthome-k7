import type { Sql } from '@repo/db'
import { rootLogger } from '@repo/logger'
import type { JobAdsHourlySalaryCalculation } from '@repo/types'
import { z } from 'zod'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { captureInvalidInput, captureProductionError } from '@/sentry'

const logger = rootLogger.child({ component: 'job-ads' })

export const JOB_ADS_PREFERENCES_SCOPE = 'job-ads'
export const ACCEPTABLE_SALARY_PREFERENCE_KEY = 'acceptable_salary'
export const HOURLY_SALARY_CALCULATION_PREFERENCE_KEY = 'hourly_salary_calculation'

export class HourlySalaryCalculationNotConfiguredError extends Error {
  constructor(reason: 'missing' | 'invalid') {
    super(
      reason === 'missing'
        ? 'job-ads: hourly salary calculation preference is not configured'
        : 'job-ads: hourly salary calculation preference is invalid',
    )
    this.name = 'HourlySalaryCalculationNotConfiguredError'
  }
}

const positiveIntegerSchema = z.number().int().positive()

const acceptableSalarySchema = positiveIntegerSchema

const hourlySalaryCalculationSchema = z.object({
  vacationDaysPerYear: positiveIntegerSchema,
  workingDaysPerYear: positiveIntegerSchema,
  workingDaysPerWeek: positiveIntegerSchema,
  timeSpentRemote: positiveIntegerSchema,
  timeSpentOffice: positiveIntegerSchema,
  hybridOfficeDaysPerWeek: positiveIntegerSchema,
}) satisfies z.ZodType<JobAdsHourlySalaryCalculation>

export function parseAcceptableSalaryValue(value: unknown): number | null {
  const result = acceptableSalarySchema.safeParse(value)
  if (!result.success) {
    if (value !== null && value !== undefined) {
      captureInvalidInput('job-ads: invalid acceptable salary value', value)
    }
    return null
  }

  return result.data
}

type PreferenceRow = {
  value: unknown
}

export async function loadAcceptableSalary(db: Sql): Promise<number | null> {
  try {
    const rows = await observeDbQuery(
      'select',
      'preferences',
      () =>
        db<PreferenceRow[]>`
        select value
        from preferences
        where scope = ${JOB_ADS_PREFERENCES_SCOPE}
          and preference_key = ${ACCEPTABLE_SALARY_PREFERENCE_KEY}
      `,
    )

    const row = rows[0]
    if (row === undefined) {
      return null
    }

    return parseAcceptableSalaryValue(row.value)
  } catch (error) {
    logger.error({ err: error }, 'Failed to load acceptable salary preference')
    captureProductionError(error)
    return null
  }
}

export async function saveAcceptableSalary(db: Sql, value: number): Promise<void> {
  await observeDbQuery(
    'insert',
    'preferences',
    () =>
      db`
      insert into preferences (scope, preference_key, value)
      values (${JOB_ADS_PREFERENCES_SCOPE}, ${ACCEPTABLE_SALARY_PREFERENCE_KEY}, ${db.json(value)})
      on conflict (scope, preference_key) do update set value = excluded.value
    `,
  )
}

export function parseHourlySalaryCalculation(value: unknown): JobAdsHourlySalaryCalculation | null {
  if (value === null || value === undefined) {
    return null
  }

  const result = hourlySalaryCalculationSchema.safeParse(value)
  if (!result.success) {
    const fieldIssue = result.error.issues.find(issue => issue.path.length > 0)
    if (fieldIssue !== undefined) {
      const field = String(fieldIssue.path[0])
      const record = typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null
      captureInvalidInput(`job-ads: invalid hourly salary calculation field ${field}`, record?.[field] ?? value)
    } else {
      captureInvalidInput('job-ads: invalid hourly salary calculation value', value)
    }
    return null
  }

  return result.data
}

export async function loadHourlySalaryCalculation(db: Sql): Promise<JobAdsHourlySalaryCalculation> {
  try {
    const rows = await observeDbQuery(
      'select',
      'preferences',
      () =>
        db<PreferenceRow[]>`
        select value
        from preferences
        where scope = ${JOB_ADS_PREFERENCES_SCOPE}
          and preference_key = ${HOURLY_SALARY_CALCULATION_PREFERENCE_KEY}
      `,
    )

    const row = rows[0]
    if (row === undefined) {
      throw new HourlySalaryCalculationNotConfiguredError('missing')
    }

    const parsed = parseHourlySalaryCalculation(row.value)
    if (parsed === null) {
      throw new HourlySalaryCalculationNotConfiguredError('invalid')
    }

    return parsed
  } catch (error) {
    if (error instanceof HourlySalaryCalculationNotConfiguredError) {
      throw error
    }

    logger.error({ err: error }, 'Failed to load hourly salary calculation preference')
    captureProductionError(error)
    throw error
  }
}
