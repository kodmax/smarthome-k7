import { HourWeatherForecast } from '@repo/types'
import { fetchDocument } from '@/fetch'
import * as suncalc from 'suncalc'
import { basename } from 'path'
import { requireElements, requireText, withScraperSource } from '@/utils/scraper'
import { weatherPageUrls } from '../urls'
import DateTime from '@/DateTime'

export const parseHourlyFromDocument = (
  document: Document,
  date: string,
  latitude: number,
  longitude: number,
): HourWeatherForecast[] =>
  withScraperSource('weather', () => {
    const hours = requireElements(document, '.hourly-wrapper .hour', 'hourly forecast')

    return hours.map(hour => {
      const precipSrc = hour.querySelector('.precip img.precip-icon')?.getAttribute('data-src') ?? ''
      const iconSrc = hour.querySelector('.icon')?.getAttribute('src') ?? ''
      if (iconSrc === '') {
        throw new Error('missing ".icon" src in hourly forecast hour')
      }

      const forecast = {
        precipIcon: basename(new URL(precipSrc, 'https://www.accuweather.com/').pathname),
        icon: basename(iconSrc),
        temp: requireText(hour, '.temp.metric', 'hourly forecast hour').replace(/[^\d-]/g, ''),
        precip: requireText(hour, '.precip', 'hourly forecast hour'),
        hour: requireText(hour, '.date', 'hourly forecast hour'),
      }

      const sunPosition = suncalc.getPosition(new Date(`${date} ${forecast.hour}:00:00`), latitude, longitude)

      return {
        sun: {
          altitude: (sunPosition.altitude / Math.PI) * 180,
          azimuth: (sunPosition.azimuth / Math.PI) * 180,
        },
        ...forecast,
      }
    })
  })

export const parseHourly = async (latitude: number, longitude: number): Promise<HourWeatherForecast[]> => {
  console.log(new DateTime().getDate(), new DateTime(24).getDate())
  const today = parseHourlyFromDocument(
    await fetchDocument(weatherPageUrls.hourly),
    new DateTime().getDate(),
    latitude,
    longitude,
  )
  const tomorrow = parseHourlyFromDocument(
    await fetchDocument(weatherPageUrls.tomorrowHourly),
    new DateTime(24).getDate(),
    latitude,
    longitude,
  )
  return [...today, ...tomorrow]
}
