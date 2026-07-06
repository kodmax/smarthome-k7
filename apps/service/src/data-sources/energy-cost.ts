import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'
import { energyRates } from './calculate-cost'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EnergyCost = {
  datetime: string
  rates: typeof energyRates
  avg: number
}

export const source: DataSourceDefinition<EnergyCost> = {
  cron: '0 0 * * *',
  id: 'energy-cost',

  expired: snapshot => (snapshot.getContent() as EnergyCost).datetime !== DateTime.now().getDate(),
  script: async () => {
    const conn = await db.getConnection()
    try {
      const from = DateTime.shift(-30, CacheAgeUnit.DAYS)
      const avg = +Number(
        (
          await conn.query('select avg(daily_consumption) as avg from daily_energy_readings where date > ?', [
            from.getDate(),
          ])
        )[0].avg,
      ).toFixed(0)

      return {
        // bill: Number((+cost.distribution + +cost.energy) * +avg).toFixed(2),
        datetime: DateTime.now().getDate(),
        rates: energyRates,
        avg,
      }
    } finally {
      conn.release()
    }
  },
}
