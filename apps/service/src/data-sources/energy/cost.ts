import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import DateTime from '../../DateTime'
import { Inject } from '@/di'
import type { Pool } from 'mariadb'
import { avgDailyConsumption, dayStart, energyRates, getEndReading, getFirstReadingSince } from './helpers'

const AVG_PERIOD_DAYS = 30

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EnergyCost = {
  datetime: string
  rates: typeof energyRates
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
    return CacheAgeUnit.DAYS
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

      return {
        // bill: Number((+cost.distribution + +cost.energy) * +avg).toFixed(2),
        datetime: today,
        rates: energyRates,
        avg,
      }
    } finally {
      conn.release()
    }
  }
}
