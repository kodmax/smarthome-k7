import { Chronos, ChronosLogger } from '@repo/chronos'
import { KnxLink } from 'js-knx'
import { clocksSync } from './clocks-sync.js'
import { logAirCondition } from './log-air-condition.js'
import { logDailyConsumption } from './log-daily-consumption.js'
import { logHourlyConsumption } from './log-hourly-consumption.js'

export function initKnxCronJobs(knx: KnxLink, log?: ChronosLogger): Chronos {
  const chronos = new Chronos(log)

  chronos.addJob('0 0 * * *', 'log-daily-consumption', () => logDailyConsumption(knx))
  chronos.addJob('0 * * * *', 'clocks-sync', () => clocksSync(knx))
  chronos.addJob('0 * * * *', 'log-hourly-consumption', () => logHourlyConsumption(knx))
  chronos.addJob('*/15 * * * *', 'log-air-condition', () => logAirCondition(knx))

  return chronos
}
