import type { Logger } from '@repo/logger'
import { KnxLink } from 'js-knx'
import { Chronos } from '@repo/chronos'
import { clocksSync } from './clocks-sync.js'
import { logAirCondition } from './log-air-condition.js'
import { logHourlyConsumption } from './log-hourly-consumption.js'

export function initKnxCronJobs(knx: KnxLink, logger?: Logger): Chronos {
  const chronos = new Chronos(logger)

  chronos.addJob('0 * * * *', 'clocks-sync', () => clocksSync(knx, logger))
  chronos.addJob('0 * * * *', 'log-hourly-consumption', () => logHourlyConsumption(knx, logger))
  chronos.addJob('*/15 * * * *', 'log-air-condition', () => logAirCondition(knx, logger))

  return chronos
}
