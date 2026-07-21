import DateTime from '../src/DateTime'
import db from '../src/db'
import {
  avgDailyConsumption,
  dayStart,
  daysBetweenReadings,
  getEndReading,
  getFirstReadingSince,
} from '../src/data-sources/energy/helpers'

const AVG_PERIOD_DAYS = 30

const test = async () => {
  const conn = await db.getConnection()
  try {
    const today = DateTime.now().getDate()
    const yesterday = DateTime.shift(-1, DateTime.DAY).getDate()
    const periodStart = DateTime.shift(-AVG_PERIOD_DAYS, DateTime.DAY).getDate()
    const start = await getFirstReadingSince(conn, dayStart(periodStart))
    const end = await getEndReading(conn, today, yesterday)

    if (!start) {
      throw new Error('No start boundary reading found')
    }

    const totalWh = end.hour_start_reading - start.hour_start_reading
    const days = daysBetweenReadings(start, end)
    const avgWhPerDay = avgDailyConsumption(start, end)

    return {
      datetime: today,
      periodStart,
      avg: +Number(avgWhPerDay).toFixed(0),
      boundary: {
        start_datetime: start.datetime,
        start_reading: start.hour_start_reading,
        end_datetime: end.datetime,
        end_reading: end.hour_start_reading,
        total_wh: totalWh,
        days,
        avg_wh_per_day: avgWhPerDay,
      },
    }
  } finally {
    conn.release()
  }
}

test().then(results => console.log(results))
