import { HourWeatherForecast } from '@repo/types'
import { fetchDocument } from '@/fetch'
import * as suncalc from 'suncalc'
import { basename } from 'path'
import { requireElements, requireText, withScraperSource } from '@/utils/scraper'
import { weatherPageUrls } from '../urls'
import DateTime from '@/DateTime'
import { CacheAgeUnit } from '@repo/apollo-ws'
import { hourlyHourSelector, parseHourlyUv, parseHourlyWind } from './parseHourlyHelpers'
import { parsePrecipType } from './parsePrecipType'

export const parseHourlyFromDocument = (
  document: Document,
  date: string,
  latitude: number,
  longitude: number,
): HourWeatherForecast[] =>
  withScraperSource('weather', () => {
    const hours = requireElements(document, hourlyHourSelector, 'hourly forecast')

    return hours.map(item => {
      const iconSrc = item.querySelector('.icon')?.getAttribute('src') ?? ''
      if (iconSrc === '') {
        throw new Error('missing ".icon" src in hourly forecast hour')
      }

      const hour = requireText(item, '.date', 'hourly forecast hour')
      const sunPosition = suncalc.getPosition(new Date(`${date} ${hour}:00:00`), latitude, longitude)

      const icon = basename(iconSrc)

      return {
        precipType: parsePrecipType(icon),
        icon,
        temp: requireText(item, '.temp.metric', 'hourly forecast hour').replace(/[^\d-]/g, ''),
        precip: requireText(item, '.precip', 'hourly forecast hour'),
        hour,
        date,
        wind: parseHourlyWind(item),
        uv: parseHourlyUv(item),
        sun: {
          altitude: (sunPosition.altitude / Math.PI) * 180,
          azimuth: (sunPosition.azimuth / Math.PI) * 180,
        },
      }
    })
  })

export const parseHourly = async (latitude: number, longitude: number): Promise<HourWeatherForecast[]> => {
  const warsawHour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Warsaw',
      hour: 'numeric',
      hour12: false,
    }).format(new Date()),
  )

  let todayDate = DateTime.now()
  if (warsawHour >= 23) {
    todayDate = todayDate.shifted(1, CacheAgeUnit.DAYS)
  }

  const tomorrowDate = todayDate.shifted(1, CacheAgeUnit.DAYS)
  const today = parseHourlyFromDocument(
    await fetchDocument(weatherPageUrls.hourly),
    todayDate.getDate(),
    latitude,
    longitude,
  )
  const tomorrow = parseHourlyFromDocument(
    await fetchDocument(weatherPageUrls.tomorrowHourly),
    tomorrowDate.getDate(),
    latitude,
    longitude,
  )
  return [...today, ...tomorrow]
}
