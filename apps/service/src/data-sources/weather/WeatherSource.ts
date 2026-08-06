import { CacheAgeUnit, DataSource } from '@repo/feeds'
import DateTime from '../../DateTime'
import { Inject } from '@/di'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import * as suncalc from 'suncalc'
import { WeatherFeed } from '@repo/types'
import type { config as AppConfig } from '../../config'
import type { Sql } from '@repo/db'
import { parseAirQuality, parseAllergens, parseForecast, parseHourly, parseInstant } from './parsers'

export class WeatherSource extends DataSource<WeatherFeed> {
  @Inject('db')
  declare private db: Sql

  @Inject('config')
  declare private config: typeof AppConfig

  static getId() {
    return 'weather'
  }

  static getCron() {
    return '*/15 * * * *'
  }

  static getCacheTTL() {
    return CacheAgeUnit.MINUTE * 15
  }

  protected getSourceMetricType() {
    return 'scraper' as const
  }

  protected async fetchData() {
    const { long, lat } = this.config.geoLocation
    const [forecast, instant, allergens, hourly, aq] = await Promise.all([
      parseForecast(),
      parseInstant(),
      parseAllergens(),
      parseHourly(lat, long),
      parseAirQuality(),
    ])

    const datetime = DateTime.now()

    await observeDbQuery(
      'insert',
      'readings',
      () =>
        this.db`
        insert into readings (timestamp, reading_name, reading_value)
        values (${datetime.getDateTime()}, 'outdoor_temp', ${instant.temp})
      `,
    )
    await observeDbQuery(
      'insert',
      'readings',
      () =>
        this.db`
        insert into readings (timestamp, reading_name, reading_value)
        values (${datetime.getDateTime()}, 'air_pressure', ${instant.pressure})
      `,
    )

    const sunTimesResult = suncalc.getTimes(new Date(), lat, long)
    const sunTimes: WeatherFeed['sunTimes'] = {
      sunrise: sunTimesResult.sunrise.toISOString(),
      sunset: sunTimesResult.sunset.toISOString(),
      dusk: sunTimesResult.dusk.toISOString(),
      dawn: sunTimesResult.dawn.toISOString(),
    }

    return {
      outdoorTemp: await observeDbQuery(
        'select',
        'readings',
        () =>
          this.db<Array<{ hour: number; value: string }>>`
          select
            extract(hour from timestamp)::int as hour,
            avg(reading_value)::text as value
          from readings
          where timestamp >= ${datetime.getDate()}
            and reading_name = 'outdoor_temp'
          group by extract(hour from timestamp)
          order by extract(hour from timestamp)
        `,
      ),
      sunTimes,
      allergens,
      forecast,
      instant,
      hourly,
      aq,
    }
  }
}
