import { describe, expect, it } from 'vitest'
import { shouldShowVentilateHint, ventilateDecision } from './ventilateDecision'

const baseInput = {
  co2Ppm: 500,
  indoorHumidity: 45,
  outdoorTempC: 12,
  outdoorHumidity: 40,
  outdoorAqi: 50,
  windSpeedMs: 3,
}

describe('ventilateDecision', () => {
  it('recommends ventilation for high CO₂ in good outdoor conditions', () => {
    expect(ventilateDecision({ ...baseInput, co2Ppm: 1600 })).toEqual({
      verdict: 'yes',
      reasonKey: 'highCo2',
    })
  })

  it('suggests maybe for elevated CO₂', () => {
    expect(ventilateDecision({ ...baseInput, co2Ppm: 1050 })).toEqual({
      verdict: 'maybe',
      reasonKey: 'elevatedCo2',
    })
  })

  it('does not recommend ventilation when air is comfortable', () => {
    expect(ventilateDecision(baseInput)).toEqual({
      verdict: 'no',
      reasonKey: 'comfortable',
    })
  })

  it('blocks ventilation in freezing outdoor temperatures', () => {
    expect(ventilateDecision({ ...baseInput, co2Ppm: 1100, outdoorTempC: 1 })).toEqual({
      verdict: 'not_now',
      reasonKey: 'tooCold',
    })
  })

  it('blocks ventilation when outdoor air quality is poor', () => {
    expect(ventilateDecision({ ...baseInput, co2Ppm: 1100, outdoorAqi: 140 })).toEqual({
      verdict: 'not_now',
      reasonKey: 'poorOutdoorAir',
    })
  })

  it('returns unknown when data is missing', () => {
    expect(ventilateDecision({ ...baseInput, co2Ppm: undefined })).toEqual({
      verdict: 'unknown',
      reasonKey: 'missingData',
    })
  })
})

describe('shouldShowVentilateHint', () => {
  it('shows hint only for yes and maybe', () => {
    expect(shouldShowVentilateHint('yes')).toBe(true)
    expect(shouldShowVentilateHint('maybe')).toBe(true)
    expect(shouldShowVentilateHint('no')).toBe(false)
    expect(shouldShowVentilateHint('not_now')).toBe(false)
  })
})
