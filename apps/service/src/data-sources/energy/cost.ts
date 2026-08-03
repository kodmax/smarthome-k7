import { DataSource, CacheAgeUnit } from '@repo/feeds'
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

export class EnergyCostSource extends DataSource<EnergyCost> {
  @Inject('db')
  declare private db: Pool

  static getId() {
    return 'energy-cost'
  }

  static getCron() {
    return '0 0 * * *'
  }

  protected isCacheValid(cached: EnergyCost) {
    return cached.datetime === DateTime.now().getDate()
  }

  static getCacheTTL() {
    return CacheAgeUnit.DAY
  }

  protected getSourceMetricType() {
    return 'db' as const
  }

  protected async fetchData() {
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
