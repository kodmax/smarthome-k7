import { CacheAgeUnit } from '@repo/apollo-ws'
import DateTime from '../src/DateTime'
import db from '../src/db'

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
      datetime: new DateTime().getDate(),
      from: from.getDate(),
      avg,
    }
  } finally {
    conn.release()
  }
}

test().then(results => console.log(results))
