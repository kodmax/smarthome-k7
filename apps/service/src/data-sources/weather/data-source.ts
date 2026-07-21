import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../../DateTime'
import { Inject } from '@/di'
import * as suncalc from 'suncalc'
import { WeatherFeed } from '@repo/types'
import type { config as AppConfig } from '../../config'
import type { Pool } from 'mariadb'
import { parseAirQuality, parseAllergens, parseForecast, parseHourly, parseInstant } from './parsers'

export class WeatherSource extends DataSourceDefinition<WeatherFeed> {
  @Inject('db')
  declare private db: Pool

  @Inject('config')
  declare private config: typeof AppConfig
  getId() {
    return 'weather'
  }

  getCron() {
    return '*/15 * * * *'
  }

  getCacheTTL() {
    return CacheAgeUnit.MINUTE * 15
  }

  async getData() {
    const { long, lat } = this.config.geoLocation
    const [forecast, instant, allergens, hourly, aq] = await Promise.all([
      parseForecast(),
      parseInstant(),
      parseAllergens(),
      parseHourly(lat, long),
      parseAirQuality(),
    ])

    const datetime = DateTime.now()
    const conn = await this.db.getConnection()
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
