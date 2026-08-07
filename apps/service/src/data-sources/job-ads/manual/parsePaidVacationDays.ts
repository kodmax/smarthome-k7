const MAX_PAID_VACATION_DAYS = 50

export function parsePaidVacationDays(value: unknown): number | undefined | null {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > MAX_PAID_VACATION_DAYS) {
    return null
  }

  return value
}
