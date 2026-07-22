function calendarDaysBetween(from: Date, to: Date): number {
  const startFrom = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const startTo = new Date(to.getFullYear(), to.getMonth(), to.getDate())

  return Math.floor((startTo.getTime() - startFrom.getTime()) / (24 * 60 * 60 * 1000))
}

export function formatAppliedDaysShort(appliedAt: string | null, now = new Date()): string | null {
  if (appliedAt === null) {
    return null
  }

  const days = calendarDaysBetween(new Date(appliedAt), now)

  return `${Math.max(days, 0)}d`
}
