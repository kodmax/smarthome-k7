import { describe, expect, it } from 'vitest'
import { currentWeatherHints } from './currentWeatherHints'

const baseInput = {
  windSpeedMs: 3,
  outdoorTempC: 12,
  uv: 4,
  outdoorAqi: 50,
}

describe('currentWeatherHints', () => {
  it('returns strong wind hint at 6 m/s and above', () => {
    expect(currentWeatherHints({ ...baseInput, windSpeedMs: 6 })).toEqual({
      hints: ['strongWind'],
      context: { windSpeedMs: 6, outdoorTempC: 12, uv: 4, outdoorAqi: 50 },
    })
  })

  it('returns hot outdoor hint at 28°C and above', () => {
    expect(currentWeatherHints({ ...baseInput, outdoorTempC: 28 })).toEqual({
      hints: ['hotOutdoor'],
      context: { windSpeedMs: 3, outdoorTempC: 28, uv: 4, outdoorAqi: 50 },
    })
  })

  it('returns high UV hint at UV 7 and above', () => {
    expect(currentWeatherHints({ ...baseInput, uv: 7 })).toEqual({
      hints: ['highUv'],
      context: { windSpeedMs: 3, outdoorTempC: 12, uv: 7, outdoorAqi: 50 },
    })
  })

  it('returns frost hint at 0°C and below', () => {
    expect(currentWeatherHints({ ...baseInput, outdoorTempC: 0 })).toEqual({
      hints: ['frost'],
      context: { windSpeedMs: 3, outdoorTempC: 0, uv: 4, outdoorAqi: 50 },
    })
  })

  it('returns poor outdoor air hint above AQI 100', () => {
    expect(currentWeatherHints({ ...baseInput, outdoorAqi: 140 })).toEqual({
      hints: ['poorOutdoorAir'],
      context: { windSpeedMs: 3, outdoorTempC: 12, uv: 4, outdoorAqi: 140 },
    })
  })

  it('returns multiple hints for independent conditions', () => {
    expect(
      currentWeatherHints({
        windSpeedMs: 8,
        outdoorTempC: 30,
        uv: 8,
        outdoorAqi: 50,
      }),
    ).toEqual({
      hints: ['strongWind', 'hotOutdoor', 'highUv'],
      context: { windSpeedMs: 8, outdoorTempC: 30, uv: 8, outdoorAqi: 50 },
    })
  })

  it('returns empty hints when data is missing', () => {
    expect(currentWeatherHints({ ...baseInput, windSpeedMs: undefined })).toEqual({
      hints: [],
      context: undefined,
    })
  })
})
