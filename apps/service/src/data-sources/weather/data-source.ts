import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import db from '../../db'
import DateTime from '../../DateTime'
import * as suncalc from 'suncalc'
import { WeatherFeed } from '@repo/types'
import { config } from '../../config'
import { parseAirQuality, parseAllergens, parseForecast, parseHourly, parseInstant } from './parsers'

const { long, lat } = config.geoLocation

export const source: DataSourceDefinition<WeatherFeed> = {
  cron: '*/15 * * * *',
  id: 'weather',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 15,
  script: async () => {
    const date = new DateTime().getDate()
    const [forecast, instant, allergens, hourly, aq] = await Promise.all([
      parseForecast(),
      parseInstant(),
      parseAllergens(),
      parseHourly(date, lat, long),
      parseAirQuality(),
    ])

    const datetime = new DateTime()
    const conn = await db.getConnection()
    try {
      await conn.query('insert into outdoor_temp (datetime, value) values (?, ?)', [
        datetime.getDateTime(),
        instant.temp,
      ])
      await conn.query('insert into pressure (datetime, pressure) values (?, ?)', [
        datetime.getDateTime(),
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
          'select hour(datetime) as hour, avg(value) as value from outdoor_temp where datetime >= ? group by hour(datetime) order by hour(datetime);',
          [datetime.getDate()],
        ),
        pressure: {
          week: await conn.query('select * from pressure where datetime >= ? order by datetime', [
            new DateTime(-14, CacheAgeUnit.DAYS).getDateTime(),
          ]),
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
  },
}
