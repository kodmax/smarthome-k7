import { fetchDocument } from '@/fetch'
import { weatherPageUrls } from '../urls'
import { requireElements, requireText } from './parseUtils'

export type AirQuality = {
  aqi: number
  pollutants: Record<string, { concentration: string; index: string }>
}

export const parseAirQualityFromDocument = (document: Document): AirQuality => {
  requireElements(document, '.air-quality-content .aq-number', 'air quality')

  const aqi = Number(requireText(document, '.air-quality-content .aq-number', 'air quality'))
  const pollutantNodes = requireElements(document, '#pollutants .air-quality-pollutant', 'air quality pollutants')

  const pollutants = Object.fromEntries(
    pollutantNodes.map(pollutant => [
      requireText(pollutant, '.display-type', 'air quality pollutant'),
      {
        concentration: requireText(pollutant, '.pollutant-concentration', 'air quality pollutant'),
        index: requireText(pollutant, '.pollutant-index', 'air quality pollutant'),
      },
    ]),
  )

  return { aqi, pollutants }
}

export const parseAirQuality = async (): Promise<AirQuality> => {
  return parseAirQualityFromDocument(await fetchDocument(weatherPageUrls.airQuality))
}
