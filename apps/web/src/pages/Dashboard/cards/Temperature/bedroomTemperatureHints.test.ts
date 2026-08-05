import { describe, expect, it } from 'vitest'
import { bedroomTemperatureHints } from './bedroomTemperatureHints'

describe('bedroomTemperatureHints', () => {
  it('returns too hot hint at 28°C and above', () => {
    expect(bedroomTemperatureHints({ bedroomTempC: 28 })).toEqual({
      hints: ['tooHot'],
      context: { bedroomTempC: 28 },
    })

    expect(bedroomTemperatureHints({ bedroomTempC: 30 })).toEqual({
      hints: ['tooHot'],
      context: { bedroomTempC: 30 },
    })
  })

  it('returns too cold hint below 20°C', () => {
    expect(bedroomTemperatureHints({ bedroomTempC: 19.9 })).toEqual({
      hints: ['tooCold'],
      context: { bedroomTempC: 19.9 },
    })
  })

  it('returns no hints in the comfortable range', () => {
    expect(bedroomTemperatureHints({ bedroomTempC: 22 })).toEqual({
      hints: [],
      context: { bedroomTempC: 22 },
    })
  })

  it('returns empty hints when temperature is unknown', () => {
    expect(bedroomTemperatureHints({ bedroomTempC: undefined })).toEqual({
      hints: [],
      context: undefined,
    })
  })
})
