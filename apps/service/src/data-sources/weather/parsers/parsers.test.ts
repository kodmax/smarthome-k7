import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { parseAirQualityFromDocument } from './parseAirQuality'
import { parseAllergensFromDocument } from './parseAllergens'
import { parseForecastFromDocument } from './parseForecast'
import { parseHourlyFromDocument } from './parseHourly'
import { parseInstantFromDocument } from './parseInstant'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

const loadDocument = (filename: string): Document => {
  const html = readFileSync(path.join(fixturesDir, filename), 'utf8')
  return parseHTML(html).window.document
}

describe('weather parsers', () => {
  it('parseForecast reads daily forecast cards', () => {
    expect(parseForecastFromDocument(loadDocument('forecast.html'))).toEqual([
      { dow: 'Nd', date: '15.06', icon: '01.svg', temp: { high: 24, low: 12 } },
      { dow: 'Pn', date: '16.06', icon: '03.svg', temp: { high: 22, low: 10 } },
    ])
  })

  it('parseForecast throws when daily cards are missing', () => {
    expect(() => parseForecastFromDocument(parseHTML('<div></div>').window.document)).toThrow(
      'weather: no elements matched ".daily-wrapper" in 10-day forecast',
    )
  })

  it('parseInstant reads current weather details', () => {
    expect(parseInstantFromDocument(loadDocument('instant.html'))).toEqual({
      temp: 18,
      humidity: 65,
      pressure: 1013,
      uv: 5.2,
      clouds: { height: '1200 m', coverage: '40%' },
      wind: { direction: 'NE', speed: 12, maxSpeed: 24, speedUnit: 'km/h', angle: 45 },
      details: {
        Wiatr: 'NE 12 km/h',
        'Porywy wiatru': '24 km/h',
        'Pułap chmur': '1200 m',
        Zachmurzenie: '40%',
        'Maksymalny wskaźnik UV': '5.2',
        Wilgotność: '65%',
        Ciśnienie: '1013 mb',
      },
    })
  })

  it('parseInstant throws when current weather details are missing', () => {
    const document = parseHTML('<div class="current-weather-card"><div class="display-temp">18°C</div></div>').window
      .document

    expect(() => parseInstantFromDocument(document)).toThrow(
      'weather: no elements matched ".current-weather-card .current-weather-details .detail-item" in current weather details',
    )
  })

  it('parseAllergens reads allergen cards', () => {
    expect(parseAllergensFromDocument(loadDocument('allergens.html'))).toEqual([
      { id: 'tree', name: 'Drzewa', intensity: 'Wysoki' },
      { id: 'grass', name: 'Trawy', intensity: 'Niski' },
    ])
  })

  it('parseHourly reads hourly rows and adds sun position', () => {
    const [hour] = parseHourlyFromDocument(loadDocument('hourly.html'), '2026-06-28', 52.23, 21.01)

    expect(hour).toMatchObject({
      hour: '14',
      temp: '21',
      precip: '10%',
      icon: '04.svg',
      precipIcon: 'rain.svg',
    })
    expect(Number.isFinite(hour.sun.altitude)).toBe(true)
    expect(Number.isFinite(hour.sun.azimuth)).toBe(true)
  })

  it('parseAirQuality reads AQI and pollutants', () => {
    expect(parseAirQualityFromDocument(loadDocument('air-quality.html'))).toEqual({
      aqi: 42,
      pollutants: {
        'PM2.5': { concentration: '12 µg/m³', index: '42' },
      },
    })
  })
})
