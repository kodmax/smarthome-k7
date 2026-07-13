import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchDocument } from '@/fetch'
import { parseAirQualityFromDocument } from './parseAirQuality'
import { parseAllergensFromDocument } from './parseAllergens'
import { parseForecastFromDocument } from './parseForecast'
import { parseHourly, parseHourlyFromDocument } from './parseHourly'
import { parseInstantFromDocument } from './parseInstant'
import { weatherPageUrls } from '../urls'

vi.mock('@/fetch', () => ({
  fetchDocument: vi.fn(),
}))

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
      wind: { direction: 'NE', speed: expect.closeTo(12 / 3.6), maxSpeed: expect.closeTo(24 / 3.6), angle: 45 },
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
      { id: 'tree-pollen', name: 'Pyłki drzew', intensity: 'Niskie' },
      { id: 'ragweed-pollen', name: 'Pyłki ambrozji', intensity: 'Niskie' },
      { id: 'mold', name: 'Pleśń', intensity: 'Niskie' },
      { id: 'grass-pollen', name: 'Pyłki traw', intensity: 'Niskie' },
      { id: 'dust-dander', name: 'Pyłki i alergeny', intensity: 'Wysokie' },
    ])
  })

  it('parseAllergens throws when allergen cards are missing', () => {
    const document = parseHTML('<div class="health-activities"></div>').window.document

    expect(() => parseAllergensFromDocument(document)).toThrow(
      'weather: no elements matched ".health-activities .health-activities__item" in allergen forecast',
    )
  })

  it('parseAllergens throws when allergen name is missing', () => {
    const document = parseHTML(
      '<div class="health-activities"><a class="health-activities__item" href="?name=tree-pollen"><span class="health-activities__item__category">Niskie</span></a></div>',
    ).window.document

    expect(() => parseAllergensFromDocument(document)).toThrow(
      'weather: missing ".health-activities__item__name" in allergen forecast item',
    )
  })

  it('parseHourly reads hourly rows and adds sun position', () => {
    const [hour] = parseHourlyFromDocument(loadDocument('hourly.html'), '2026-06-28', 52.23, 21.01)

    expect(hour).toMatchObject({
      date: '2026-06-28',
      hour: '14',
      temp: '21',
      precip: '10%',
      icon: '04.svg',
      precipIcon: 'rain.svg',
    })
    expect(hour.wind).toEqual({ direction: 'NE', speed: expect.closeTo(12 / 3.6) })
    expect(hour.uv).toBe(8)
    expect(Number.isFinite(hour.sun.altitude)).toBe(true)
    expect(Number.isFinite(hour.sun.azimuth)).toBe(true)
  })

  it('parseHourly attaches passed date to every hour', () => {
    const hours = parseHourlyFromDocument(loadDocument('hourly.html'), '2026-06-28', 52.23, 21.01)

    expect(hours.every(hour => hour.date === '2026-06-28')).toBe(true)
  })

  it('parseHourly throws when hourly wrapper is empty', () => {
    const document = parseHTML('<div class="hourly-wrapper"></div>').window.document

    expect(() => parseHourlyFromDocument(document, '2026-06-28', 52.23, 21.01)).toThrow(
      'weather: no elements matched ".accordion-item.hour, .hourly-wrapper .hour" in hourly forecast',
    )
  })

  it('parseHourly throws when hour icon is missing', () => {
    const document = parseHTML(
      '<div class="accordion-item hour"><h2 class="date"><div>14</div></h2><div class="temp metric">21°</div><div class="precip">10%</div><div class="panel"><p>Wiatr<span class="value">NE 12 km/h</span></p></div></div>',
    ).window.document

    expect(() => parseHourlyFromDocument(document, '2026-06-28', 52.23, 21.01)).toThrow(
      'weather: missing ".icon" src in hourly forecast hour',
    )
  })

  it('parseHourly throws when wind is missing from panel', () => {
    const document = parseHTML(
      '<div class="accordion-item hour"><h2 class="date"><div>14</div></h2><img class="icon" src="/images/04.svg" /><div class="temp metric">21°</div><div class="precip">10%</div></div>',
    ).window.document

    expect(() => parseHourlyFromDocument(document, '2026-06-28', 52.23, 21.01)).toThrow(
      'weather: missing "Wiatr" in hourly forecast panel',
    )
  })

  it('parseAirQuality reads AQI and pollutants', () => {
    expect(parseAirQualityFromDocument(loadDocument('air-quality.html'))).toEqual({
      aqi: 42,
      pollutants: {
        'PM2.5': { concentration: '12 µg/m³', index: '42' },
      },
    })
  })

  it('parseAirQuality throws when AQI number is missing', () => {
    const document = parseHTML('<div class="air-quality-content"></div>').window.document

    expect(() => parseAirQualityFromDocument(document)).toThrow(
      'weather: no elements matched ".air-quality-content .aq-number" in air quality',
    )
  })

  it('parseAirQuality throws when pollutants are missing', () => {
    const document = parseHTML(
      '<div class="air-quality-content"><span class="aq-number">42</span></div><div id="pollutants"></div>',
    ).window.document

    expect(() => parseAirQualityFromDocument(document)).toThrow(
      'weather: no elements matched "#pollutants .air-quality-pollutant" in air quality pollutants',
    )
  })
})

describe('parseHourly', () => {
  const fixedNow = new Date('2025-06-28T14:30:45.123Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fixedNow)
    vi.mocked(fetchDocument).mockImplementation(async url => {
      if (url === weatherPageUrls.hourly || url === weatherPageUrls.tomorrowHourly) {
        return loadDocument('hourly.html')
      }

      throw new Error(`unexpected url: ${url}`)
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('combines today and tomorrow hourly forecasts with distinct dates', async () => {
    const result = await parseHourly(52.23, 21.01)

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ date: '2025-06-28', hour: '14' })
    expect(result[1]).toMatchObject({ date: '2025-06-29', hour: '14' })
  })

  it('uses the next day as today after 23:00 in Europe/Warsaw', async () => {
    vi.setSystemTime(new Date('2025-06-29T21:30:00.000Z'))

    const result = await parseHourly(52.23, 21.01)

    expect(result[0]).toMatchObject({ date: '2025-06-30', hour: '14' })
    expect(result[1]).toMatchObject({ date: '2025-07-01', hour: '14' })
  })

  it('fetches today and tomorrow hourly pages', async () => {
    await parseHourly(52.23, 21.01)

    expect(fetchDocument).toHaveBeenCalledWith(weatherPageUrls.hourly)
    expect(fetchDocument).toHaveBeenCalledWith(weatherPageUrls.tomorrowHourly)
  })
})
