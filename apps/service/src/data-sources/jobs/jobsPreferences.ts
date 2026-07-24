import type { Pool } from 'mariadb'

export const JOBS_PREFERENCES_SCOPE = 'jobs'
export const ACCEPTABLE_SALARY_PREFERENCE_KEY = 'acceptable_salary'

export type SetAcceptableSalaryCommandArgs = {
  value: number
}

export function parseAcceptableSalaryValue(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return null
  }

  return value
}

export function parseSetAcceptableSalaryCommandArgs(args: string): SetAcceptableSalaryCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    const value = parseAcceptableSalaryValue(parsed.value)
    if (value === null) {
      return null
    }

    return { value }
  } catch {
    return null
  }
}

type PreferenceRow = {
  value: unknown
}

export async function loadAcceptableSalary(db: Pool): Promise<number | null> {
  const conn = await db.getConnection()
  try {
    const rows = (await conn.query(
      `select value
       from preferences
       where scope = ?
         and preference_key = ?`,
      [JOBS_PREFERENCES_SCOPE, ACCEPTABLE_SALARY_PREFERENCE_KEY],
    )) as PreferenceRow[]

    const row = rows[0]
    if (row === undefined) {
      return null
    }

    return parseAcceptableSalaryValue(row.value)
  } catch {
    return null
  } finally {
    conn.release()
  }
}

export async function saveAcceptableSalary(db: Pool, value: number): Promise<void> {
  const conn = await db.getConnection()
  try {
    await conn.query(
      `insert into preferences (scope, preference_key, value)
       values (?, ?, ?)
       on duplicate key update value = values(value)`,
      [JOBS_PREFERENCES_SCOPE, ACCEPTABLE_SALARY_PREFERENCE_KEY, value],
    )
  } finally {
    conn.release()
  }
}
