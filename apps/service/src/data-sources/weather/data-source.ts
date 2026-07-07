import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import db from '../../db'
import DateTime from '../../DateTime'
import * as suncalc from 'suncalc'
import { WeatherFeed } from '@repo/types'
import { config } from '../../config'
import { parseAirQuality, parseAllergens, parseForecast, parseHourly, parseInstant } from './parsers'

const { long, lat } = config.geoLocation

export class WeatherSource extends DataSourceDefinition<WeatherFeed> {
  getId() {
    return 'weather'
  }

  getCron() {
    return '*/15 * * * *'
  }

  isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }) {
    return snapshot.age(CacheAgeUnit.MINUTES) > 15
  }

  async getData() {
    const [forecast, instant, allergens, hourly, aq] = await Promise.all([
      parseForecast(),
      parseInstant(),
      parseAllergens(),
      parseHourly(lat, long),
      parseAirQuality(),
    ])

    const datetime = DateTime.now()
    const conn = await db.getConnection()
    try {
      await conn.query('insert into readings (timestamp, reading_name, reading_value) values (?, ?, ?)', [
        datetime.getDateTime(),
        'outdoor_temp',
        instant.temp,
      ])
      await conn.query('insert into readings (timestamp, reading_name, reading_value) values (?, ?, ?)', [
        datetime.getDateTime(),
        'air_pressure',
        instant.pressure,
      ])

      const sunTimesResult = suncalc.getTimes(new Date(), lat, long)
      const sunTimes: WeatherFeed['sunTimes'] = {
        sunrise: sunTimesResult.sunrise.toISOString(),
        sunset: sunTimesResult.sunset.toISOString(),
        dusk: sunTimesResult.dusk.toISOString(),
        dawn: sunTimesResult.dawn.toISOString(),
      }

      return {
        outdoorTemp: await conn.query(
          `select
              hour(timestamp) as hour,
              avg(reading_value) as value
              from readings
              where timestamp >= ?
                and reading_name = 'outdoor_temp'
              group by hour(timestamp)
              order by hour(timestamp)`,
          [datetime.getDate()],
        ),
        pressure: {
          week: await conn.query(
            `select
                reading_value as pressure,
                timestamp as datetime
                from readings
                where timestamp >= ?
                  and reading_name = 'air_pressure'
                order by timestamp`,
            [DateTime.shift(-14, CacheAgeUnit.DAYS).getDateTime()],
          ),
          instant: instant.pressure,
        },
        sunTimes,
        allergens,
        forecast,
        instant,
        hourly,
        aq,
      }
    } finally {
      conn.release()
    }
  }
}
