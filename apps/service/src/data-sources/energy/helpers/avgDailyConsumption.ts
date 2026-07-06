import { daysBetweenReadings } from './daysBetweenReadings'
import type { HourlyReading } from './types'

export const avgDailyConsumption = (start: HourlyReading, end: HourlyReading): number =>
  (end.hour_start_reading - start.hour_start_reading) / daysBetweenReadings(start, end)
