import { z } from 'zod'

const MAX_PAID_VACATION_DAYS = 50

const paidVacationDaysSchema = z.number().int().min(0).max(MAX_PAID_VACATION_DAYS)

export function parsePaidVacationDays(value: unknown): number | undefined | null {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  const result = paidVacationDaysSchema.safeParse(value)
  if (!result.success) {
    return null
  }

  return result.data
}
