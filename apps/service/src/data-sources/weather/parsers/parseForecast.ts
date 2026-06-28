import { DayWeatherForecast } from '@repo/types'
import { fetchDocument } from '@/fetch'
import { basename } from 'path'
import { withScraperSource } from '../../utils/require-scraper'
import { weatherPageUrls } from '../urls'
import { requireElements, requireText } from './parseUtils'

export const parseForecastFromDocument = (document: Document): DayWeatherForecast[] =>
  withScraperSource('weather', () => {
    const days = requireElements(document, '.daily-wrapper', '10-day forecast')

    return days.map(day => {
      const date = requireText(day, '.sub.date', 'daily forecast day')
      const dow = requireText(day, '.dow.date', 'daily forecast day')
      const icon = basename(day.querySelector('.icon')?.getAttribute('src') ?? '')
      if (icon === '') {
        throw new Error('missing ".icon" src in daily forecast day')
      }

      return {
        dow,
        date,
        icon,
        temp: {
          high: Number(requireText(day, '.temp .high', 'daily forecast day').replace(/[^\d-]/g, '')),
          low: Number(requireText(day, '.temp .low', 'daily forecast day').replace(/[^\d-]/g, '')),
        },
      }
    })
  })

export const parseForecast = async (): Promise<DayWeatherForecast[]> => {
  return parseForecastFromDocument(await fetchDocument(weatherPageUrls.forecast))
}
