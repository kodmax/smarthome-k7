import { describe, expect, it } from 'vitest'
import { parseWindValue } from './parseWindValue'

describe('parseWindValue', () => {
  it('parses direction, speed and unit', () => {
    expect(parseWindValue('NNW 13 km/h')).toEqual({
      direction: 'NNW',
      speed: 13,
      speedUnit: 'km/h',
    })
  })

  it('parses calm wind without direction', () => {
    expect(parseWindValue('0 km/h')).toEqual({
      direction: '',
      speed: 0,
      speedUnit: 'km/h',
    })
  })

  it('throws on malformed wind text', () => {
    expect(() => parseWindValue('NNW 13')).toThrow('malformed wind detail value "NNW 13"')
  })
})
