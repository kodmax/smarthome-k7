import { DataSourceDefinition, CacheAgeUnit } from '@repo/feeds'
import { EnergyRates } from '@repo/types'
import DateTime from '../../DateTime'
import { Inject } from '@/di'
import type { Pool } from 'mariadb'
import { avgDailyConsumption, dayStart, getEndReading, getEnergyRatesAt, getFirstReadingSince } from './helpers'

const AVG_PERIOD_DAYS = 30

type EnergyCost = {
  datetime: string
  rates: EnergyRates
  avg: number
}

export class EnergyCostSource extends DataSourceDefinition<EnergyCost> {
  @Inject('db')
  declare private db: Pool
  getId() {
    return 'energy-cost'
  }

  getCron() {
    return '0 0 * * *'
  }

  isCacheValid(cached: EnergyCost) {
    return cached.datetime === DateTime.now().getDate()
  }

  getCacheTTL() {
    return CacheAgeUnit.DAY
  }

  getSourceMetricType() {
    return 'db' as const
  }

  async getData() {
    const conn = await this.db.getConnection()
    try {
      const today = DateTime.now().getDate()
      const yesterday = DateTime.shift(-1, DateTime.DAY).getDate()
      const periodStart = DateTime.shift(-AVG_PERIOD_DAYS, DateTime.DAY).getDate()
      const start = await getFirstReadingSince(conn, dayStart(periodStart))

      if (!start) {
        throw new Error(`No hourly energy readings found for ${AVG_PERIOD_DAYS}-day start boundary`)
      }

      const end = await getEndReading(conn, today, yesterday)
      const avg = +Number(avgDailyConsumption(start, end).toFixed(0))
      const rates = await getEnergyRatesAt(conn, today)

      if (!rates) {
        throw new Error(`No energy rates found effective at ${today}`)
      }

      return {
        datetime: today,
        rates,
        avg,
      }
    } finally {
      conn.release()
    }
  }
}
