import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'
import { EnergyRates } from '@repo/types'

const rates: EnergyRates = {
  added: 33.8,
  distribution: '0.16036',
  energy: '0.5376',
  vat: 1.23,
}

export const calculateCost = (energy: number): string => {
  return (energy * (+rates.distribution + +rates.energy)).toFixed(2)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const source: DataSourceDefinition<{ datetime: string; rates: EnergyRates; avg: number }> = {
  cron: '0 0 * * *',
  id: 'energy-cost',

  expired: snapshot => snapshot.getContent().datetime !== new DateTime().getDate(),
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
        rates,
        avg,
      }
    } finally {
      conn.release()
    }
  },
}
