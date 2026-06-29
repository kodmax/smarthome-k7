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

  expired: snapshot => (snapshot.getContent() as EnergyCost).datetime !== new DateTime().getDate(),
  script: async () => {
    const conn = await db.getConnection()
    try {
      const from = new DateTime(-30, CacheAgeUnit.DAYS)
      const avg = +Number(
        (
          await conn.query('select avg(daily_consumption) as avg from daily_energy_readings where date > ?', [
            from.getDate(),
          ])
        )[0].avg,
      ).toFixed(0)

      return {
        // bill: Number((+cost.distribution + +cost.energy) * +avg).toFixed(2),
        datetime: new DateTime().getDate(),
        rates: energyRates,
        avg,
      }
    } finally {
      conn.release()
    }
  },
}
