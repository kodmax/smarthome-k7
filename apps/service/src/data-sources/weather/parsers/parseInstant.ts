import { fetchDocument } from '@/fetch'
import { requireElements, requireText, withScraperSource } from '@/utils/scraper'
import { weatherPageUrls } from '../urls'
import { windDirectionCodes } from './windDirectionCodes'

const requireDetail = (details: Record<string, string>, key: string, context: string): string => {
  const value = details[key]
  if (value === undefined) {
    throw new Error(`missing detail "${key}" in ${context}`)
  }

  return value
}

export type InstantWeather = {
  clouds: {
    height: string
    coverage: string
  }
  wind: {
    angle: number
    maxSpeed: number
    speedUnit: string
    direction: string
    speed: number
  }
  uv: number
  humidity: number
  pressure: number
  details: Record<string, string>
  temp: number
}

export const parseInstantFromDocument = (document: Document): InstantWeather =>
  withScraperSource('weather', () => {
    requireElements(document, '.current-weather-card .display-temp', 'current weather')

    const temp = Number(
      requireText(document, '.current-weather-card .display-temp', 'current weather').replace('°C', ''),
    )
    const detailItems = requireElements(
      document,
      '.current-weather-card .current-weather-details .detail-item',
      'current weather details',
    )

    const details: Record<string, string> = Object.fromEntries(
      detailItems.map(detail => {
        const label = detail.children[0]?.textContent?.trim()
        const value = detail.children[1]?.textContent?.trim()
        if (label === undefined || label === '' || value === undefined || value === '') {
          throw new Error('malformed ".detail-item" in current weather details')
        }

        return [label, value]
      }),
    )

    const wind = requireDetail(details, 'Wiatr', 'current weather details')
    const [windDirection, windSpeed, windSpeedUnit] = wind.split(' ')
    if (windDirection === undefined || windSpeed === undefined || windSpeedUnit === undefined) {
      throw new Error(`malformed "Wiatr" detail value "${wind}"`)
    }

    const gusts = requireDetail(details, 'Porywy wiatru', 'current weather details')
    const uvRaw = details['Maksymalny wskaźnik UV']

    return {
      clouds: {
        height: requireDetail(details, 'Pułap chmur', 'current weather details'),
        coverage: requireDetail(details, 'Zachmurzenie', 'current weather details'),
      },
      wind: {
        angle: Number(windDirectionCodes.indexOf(windDirection as (typeof windDirectionCodes)[number]) * 22.5),
        maxSpeed: Number(gusts.split(' ')[0]),
        speedUnit: windSpeedUnit,
        direction: windDirection,
        speed: Number(windSpeed),
      },
      uv: uvRaw !== undefined ? Number(uvRaw.replace(/[^\d.]/g, '')) : 0,
      humidity: Number(requireDetail(details, 'Wilgotność', 'current weather details').replace(/[^\d]/g, '')),
      pressure: Number(requireDetail(details, 'Ciśnienie', 'current weather details').replace(/[^\d]/g, '')),
      details,
      temp,
    }
  })

export const parseInstant = async (): Promise<InstantWeather> => {
  return parseInstantFromDocument(await fetchDocument(weatherPageUrls.instant))
}
