export const CronDayOfWeek = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
} as const

export const CronMonth = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
} as const

export const TICK_INTERVAL_MS = 60_000

export const TICK_LEAD_MS = 5_000

export const LOG_PRIORITY_WARN = 3

export const LOG_PRIORITY_INFO = 4

export const CRON_MINUTE = { min: 0, max: 59 } as const

export const CRON_HOUR = { min: 0, max: 23 } as const

export const CRON_DAY_OF_MONTH = { min: 1, max: 31 } as const

export const CRON_MONTH = { min: 1, max: 12 } as const

export const CRON_DAY_OF_WEEK = { min: 0, max: 6 } as const
