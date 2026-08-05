import { describe, expect, it } from 'vitest'
import { indoorAirHints } from './indoorAirHints'

const baseInput = {
  co2Ppm: 500,
  indoorHumidity: 45,
  outdoorTempC: 12,
  outdoorAqi: 50,
  windSpeedMs: 3,
}

describe('indoorAirHints', () => {
  it('returns high CO₂ hint when concentration is elevated', () => {
    expect(indoorAirHints({ ...baseInput, co2Ppm: 1600 })).toEqual(['highCo2'])
  })

  it('returns elevated CO₂ hint for moderate levels', () => {
    expect(indoorAirHints({ ...baseInput, co2Ppm: 1050 })).toEqual(['elevatedCo2'])
  })

  it('returns no hints when air is comfortable', () => {
    expect(indoorAirHints(baseInput)).toEqual([])
  })

  it('hides ventilate hints when outdoor heat blocks ventilation', () => {
    expect(indoorAirHints({ ...baseInput, co2Ppm: 1600, indoorHumidity: 65, outdoorTempC: 30 })).toEqual([])
  })

  it('hides ventilate hints when wind blocks ventilation', () => {
    expect(indoorAirHints({ ...baseInput, co2Ppm: 1600, windSpeedMs: 16 })).toEqual([])
  })

  it('hides ventilate hints when outdoor air quality blocks ventilation', () => {
    expect(indoorAirHints({ ...baseInput, co2Ppm: 1600, outdoorAqi: 140 })).toEqual([])
  })

  it('returns high humidity hint when indoor humidity is elevated', () => {
    expect(indoorAirHints({ ...baseInput, indoorHumidity: 65 })).toEqual(['highHumidity'])
  })

  it('returns empty hints when data is missing', () => {
    expect(indoorAirHints({ ...baseInput, co2Ppm: undefined })).toEqual([])
  })
})
