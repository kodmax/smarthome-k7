import { CacheAgeUnit } from 'apollo-ws'
import DateTime from './DateTime'
import db from './db'

const test = async () => {
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
      from: from.getDate(),
      avg,
    }
  } finally {
    await conn.end()
  }
}

test().then(results => console.log(results))
