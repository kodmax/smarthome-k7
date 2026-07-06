import type { HourlyReading } from './types'

const msPerDay = 24 * 60 * 60 * 1000

export const daysBetweenReadings = (start: HourlyReading, end: HourlyReading): number => {
  const days = (new Date(end.datetime).getTime() - new Date(start.datetime).getTime()) / msPerDay

  if (days <= 0) {
    throw new Error('Invalid reading date range for average consumption')
  }

  return days
}
