function calendarDaysBetween(from: Date, to: Date): number {
  const startFrom = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const startTo = new Date(to.getFullYear(), to.getMonth(), to.getDate())

  return Math.floor((startTo.getTime() - startFrom.getTime()) / (24 * 60 * 60 * 1000))
}

export function isPublishedToday(publishedAt: string, now = new Date()): boolean {
  return calendarDaysBetween(new Date(publishedAt), now) === 0
}
