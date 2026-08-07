import type { ChronosOptions } from '@repo/chronos'
import { KnxLink } from 'js-knx'
import { Chronos } from '@repo/chronos'
import { clocksSync } from './clocks-sync.js'
import { logAirCondition } from './log-air-condition.js'
import { logHourlyConsumption } from './log-hourly-consumption.js'

export function initKnxCronJobs(knx: KnxLink, options: ChronosOptions = {}): Chronos {
  const chronos = new Chronos(options)
  const logger = options.logger

  chronos.addJob({
    namespace: 'knx',
    id: 'clocks-sync',
    cron: '0 * * * *',
    script: () => clocksSync(knx, logger),
  })
  chronos.addJob({
    namespace: 'knx',
    id: 'log-hourly-consumption',
    cron: '0 * * * *',
    script: () => logHourlyConsumption(knx, logger),
  })
  chronos.addJob({
    namespace: 'knx',
    id: 'log-air-condition',
    cron: '*/15 * * * *',
    script: () => logAirCondition(knx, logger),
  })

  return chronos
}
