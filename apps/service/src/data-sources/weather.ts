import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { myFetch } from '../fetch'
import db from '../db'
import DateTime from '../DateTime'
import { parseHTML } from 'linkedom'
import * as suncalc from 'suncalc'
import { basename } from 'path'
import { getTextContent } from './utils/get-text-context'
import { WeatherData } from '@repo/types'
import { config } from '../config'

const windDirectionCodes = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
]

const long = config.geoLocation.long
const lat = config.geoLocation.lat

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const source: DataSourceDefinition<WeatherData> = {
  cron: '*/15 * * * *',
  id: 'weather',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 15,
  script: async () => {
    const date = new DateTime().getDate()
    const [forecast, instant, allergens, hourly, aq] = await Promise.all([
      myFetch('https://www.accuweather.com/pl/pl/warsaw/274663/10-day-weather-forecast/274663')
        .then(content => parseHTML(content.toString('utf-8')).window.document)
        .then((document: Document) => {
          const forecast = []
          for (const day of Array.from(document.querySelectorAll('.daily-wrapper'))) {
            const date = getTextContent(day, '.sub.date')
            const dow = getTextContent(day, '.dow.date')
            const icon = basename(day.querySelector('.icon')?.getAttribute('src') ?? '')
            const temp = {
              high: Number(getTextContent(day, '.temp .high').replace(/[^\d-]/g, '')),
              low: Number(getTextContent(day, '.temp .low').replace(/[^\d-]/g, '')),
            }

            forecast.push({ dow, date, icon, temp })
          }

          return forecast
        }),

      myFetch('https://www.accuweather.com/pl/pl/warsaw/274663/current-weather/274663')
        .then(content => parseHTML(content.toString('utf-8')).window.document)
        .then((document: Document) => {
          const temp = Number(getTextContent(document.body, '.current-weather-card .display-temp').replace('°C', ''))
          const details: Record<string, string> = Object.fromEntries(
            Array.from(document.querySelectorAll('.current-weather-card .current-weather-details .detail-item')).map(
              detail => [detail.children[0].textContent, detail.children[1].textContent],
            ),
          )

          const [windDirection, windSpeed, windSpeedUnit] = details['Wiatr'].split(' ')
          return {
            clouds: {
              height: details['Pułap chmur'],
              coverage: details['Zachmurzenie'],
            },
            wind: {
              angle: Number(windDirectionCodes.indexOf(windDirection) * 22.5),
              maxSpeed: Number(details['Porywy wiatru'].split(' ')[0]),
              speedUnit: windSpeedUnit,
              direction: windDirection,
              speed: Number(windSpeed),
            },
            uv: details['Maksymalny wskaźnik UV']
              ? Number(details['Maksymalny wskaźnik UV'].replace(/[^\d.]/g, ''))
              : 0,
            humidity: Number(details['Wilgotność'].replace(/[^\d]/g, '')),
            pressure: Number(details['Ciśnienie'].replace(/[^\d]/g, '')),
            details,
            temp,
          }
        }),

      myFetch('https://www.accuweather.com/pl/pl/warsaw/274663/weather-forecast/274663')
        .then(content => parseHTML(content.toString('utf-8')).window.document)
        .then((document: Document) => {
          return Array.from(document.querySelectorAll('.allergy-forecast .allergy') as NodeListOf<HTMLAnchorElement>)
            .slice(0, 5)
            .map(allergen => {
              return {
                id: new URL(allergen.getAttribute('href') ?? '', 'https://www.accuweather.com/').searchParams.get(
                  'name',
                ),
                name: getTextContent(allergen, '.allergy-name'),
                intensity: getTextContent(allergen, '.allergy-value'),
              }
            })
        }),

      myFetch('https://www.accuweather.com/pl/pl/warsaw/274663/hourly-weather-forecast/274663')
        .then(content => parseHTML(content.toString('utf-8')).window.document)
        .then((document: Document) => {
          return Array.from(document.querySelectorAll('.hourly-wrapper .hour'))
            .map(hour => {
              return {
                precipIcon: basename(
                  new URL(hour.querySelector('.precip img.precip-icon')?.getAttribute('data-src') ?? '').pathname,
                ),
                icon: basename(hour.querySelector('.icon')?.getAttribute('src') ?? ''),
                temp: getTextContent(hour, '.temp.metric').replace(/[^\d-]/g, ''),
                precip: getTextContent(hour, '.precip'),
                hour: getTextContent(hour, '.date'),
              }
            })
            .map(forecast => {
              const sunPosition = suncalc.getPosition(new Date(`${date} ${forecast.hour}:00:00`), lat, long)
              return {
                sun: {
                  altitude: (sunPosition.altitude / Math.PI) * 180,
                  azimuth: (sunPosition.azimuth / Math.PI) * 180,
                },
                ...forecast,
              }
            })
        }),

      myFetch('https://www.accuweather.com/pl/pl/warsaw/274663/air-quality-index/274663')
        .then(content => parseHTML(content.toString('utf-8')).window.document)
        .then((document: Document) => {
          const aqi = +getTextContent(document.body, '.air-quality-content .aq-number')
          const pollutants = Object.fromEntries(
            Array.from(document.querySelectorAll('#pollutants .air-quality-pollutant')).map(pollutant => {
              return [
                getTextContent(pollutant, '.display-type'),
                {
                  concentration: getTextContent(pollutant, '.pollutant-concentration'),
                  index: getTextContent(pollutant, '.pollutant-index'),
                },
              ]
            }),
          )

          return { aqi, pollutants }
        }),
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

      const sunTimesResult = suncalc.getTimes(new Date(), 52.2283698, 20.973194)
      const sunTimes: WeatherData['sunTimes'] = {
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
      await conn.end()
    }
  },
}
