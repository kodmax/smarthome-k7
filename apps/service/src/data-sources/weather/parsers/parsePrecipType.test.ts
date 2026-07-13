import { describe, expect, it } from 'vitest'
import { parsePrecipType, parseWeatherIconCode } from './parsePrecipType'

describe('parseWeatherIconCode', () => {
  it('parses AccuWeather icon filenames', () => {
    expect(parseWeatherIconCode('22.svg')).toBe(22)
    expect(parseWeatherIconCode('04.svg')).toBe(4)
  })
})

describe('parsePrecipType', () => {
  it('maps rain icons', () => {
    expect(parsePrecipType('18.svg')).toBe('rain')
    expect(parsePrecipType('12.svg')).toBe('rain')
  })

  it('maps snow icons', () => {
    expect(parsePrecipType('22.svg')).toBe('snow')
    expect(parsePrecipType('44.svg')).toBe('snow')
  })

  it('maps hail from thunderstorm icons', () => {
    expect(parsePrecipType('15.svg')).toBe('hail')
    expect(parsePrecipType('41.svg')).toBe('hail')
  })

  it('maps sleet and ice icons', () => {
    expect(parsePrecipType('25.svg')).toBe('sleet')
    expect(parsePrecipType('24.svg')).toBe('ice')
    expect(parsePrecipType('26.svg')).toBe('ice')
  })

  it('maps mixed rain and snow', () => {
    expect(parsePrecipType('29.svg')).toBe('mixed')
  })

  it('returns none for non-precipitation icons', () => {
    expect(parsePrecipType('04.svg')).toBe('none')
    expect(parsePrecipType('33.svg')).toBe('none')
  })
})
