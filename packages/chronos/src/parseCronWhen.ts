import {
  CRON_DAY_OF_MONTH,
  CRON_DAY_OF_WEEK,
  CRON_HOUR,
  CRON_MINUTE,
  CRON_MONTH,
  CronDayOfWeek,
  CronMonth,
} from './constants'
import { decode } from './decode'

export const parseCronWhen = (cron: string): number[][] => {
  const [nn, hh, dm, mm, dw] = cron.split(/\s/)

  return [
    decode(nn, CRON_MINUTE.min, CRON_MINUTE.max),
    decode(hh, CRON_HOUR.min, CRON_HOUR.max),
    decode(dm, CRON_DAY_OF_MONTH.min, CRON_DAY_OF_MONTH.max),
    decode(mm, CRON_MONTH.min, CRON_MONTH.max, CronMonth),
    decode(dw, CRON_DAY_OF_WEEK.min, CRON_DAY_OF_WEEK.max, CronDayOfWeek),
  ]
}
