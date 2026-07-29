import type { Pool } from 'mariadb'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { captureInvalidInput, captureProductionError } from '@/sentry'

export const JOB_ADS_PREFERENCES_SCOPE = 'job-ads'
export const ACCEPTABLE_SALARY_PREFERENCE_KEY = 'acceptable_salary'

export type SetAcceptableSalaryCommandArgs = {
  value: number
}

export function parseAcceptableSalaryValue(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    if (value !== null && value !== undefined) {
      captureInvalidInput('job-ads: invalid acceptable salary value', value)
    }
    return null
  }

  return value
}

export function parseSetAcceptableSalaryCommandArgs(args: string): SetAcceptableSalaryCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (!('value' in parsed)) {
      captureInvalidInput('job-ads: invalid set-acceptable-salary command args', args)
      return null
    }

    const value = parseAcceptableSalaryValue(parsed.value)
    if (value === null) {
      return null
    }

    return { value }
  } catch (cause) {
    captureInvalidInput('job-ads: failed to parse set-acceptable-salary command args', cause)
    return null
  }
}

type PreferenceRow = {
  value: unknown
}

export async function loadAcceptableSalary(db: Pool): Promise<number | null> {
  const conn = await db.getConnection()
  try {
    const rows = (await observeDbQuery('select', 'preferences', () =>
      conn.query(
        `select value
       from preferences
       where scope = ?
         and preference_key = ?`,
        [JOB_ADS_PREFERENCES_SCOPE, ACCEPTABLE_SALARY_PREFERENCE_KEY],
      ),
    )) as PreferenceRow[]

    const row = rows[0]
    if (row === undefined) {
      return null
    }

    return parseAcceptableSalaryValue(row.value)
  } catch (error) {
    captureProductionError(error)
    return null
  } finally {
    conn.release()
  }
}

export async function saveAcceptableSalary(db: Pool, value: number): Promise<void> {
  const conn = await db.getConnection()
  try {
    await observeDbQuery('insert', 'preferences', () =>
      conn.query(
        `insert into preferences (scope, preference_key, value)
       values (?, ?, ?)
       on duplicate key update value = values(value)`,
        [JOB_ADS_PREFERENCES_SCOPE, ACCEPTABLE_SALARY_PREFERENCE_KEY, value],
      ),
    )
  } finally {
    conn.release()
  }
}
