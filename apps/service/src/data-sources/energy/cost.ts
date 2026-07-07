import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import DateTime from '../../DateTime'
import db from '../../db'
import { avgDailyConsumption, dayStart, energyRates, getEndReading, getFirstReadingSince } from './helpers'

const AVG_PERIOD_DAYS = 30

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EnergyCost = {
  datetime: string
  rates: typeof energyRates
  avg: number
}

export class EnergyCostSource extends DataSourceDefinition<EnergyCost> {
  getId() {
    return 'energy-cost'
  }

  getCron() {
    return '0 0 * * *'
  }

  isSnapshotExpired(snapshot: { getContent: () => unknown }) {
    return (snapshot.getContent() as EnergyCost).datetime !== DateTime.now().getDate()
  }

  async getData() {
    const conn = await db.getConnection()
    try {
      const today = DateTime.now().getDate()
      const yesterday = DateTime.shift(-1, CacheAgeUnit.DAYS).getDate()
      const periodStart = DateTime.shift(-AVG_PERIOD_DAYS, CacheAgeUnit.DAYS).getDate()
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
