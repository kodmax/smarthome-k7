export const truncateToMinute = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0)

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)

export const cronMatchesAt = (when: number[][], date: Date): boolean => {
  const month = date.getMonth() + 1
  const minute = date.getMinutes()
  const hour = date.getHours()
  const dayOfMonth = date.getDate()
  const dayOfWeek = date.getDay()

  return (
    when[0].includes(minute) &&
    when[1].includes(hour) &&
    when[2].includes(dayOfMonth) &&
    when[3].includes(month) &&
    when[4].includes(dayOfWeek)
  )
}

export const getMissedScheduledTimes = (when: number[][], after: Date | undefined, until: Date): Date[] => {
  const untilMinute = truncateToMinute(until)
  let cursor = after !== undefined ? new Date(truncateToMinute(after).getTime() + 60_000) : startOfDay(untilMinute)

  const missed: Date[] = []

  while (cursor <= untilMinute) {
    if (cronMatchesAt(when, cursor)) {
      missed.push(new Date(cursor))
    }

    cursor = new Date(cursor.getTime() + 60_000)
  }

  return missed
}

export const getLatestScheduledTime = (when: number[][], until: Date): Date | undefined => {
  const untilMinute = truncateToMinute(until)
  const horizon = new Date(untilMinute.getTime() - 366 * 24 * 60 * 60_000)
  let cursor = untilMinute

  while (cursor >= horizon) {
    if (cronMatchesAt(when, cursor)) {
      return new Date(cursor)
    }

    cursor = new Date(cursor.getTime() - 60_000)
  }

  return undefined
}
