import { describe, expect, it } from 'vitest'
import { formatHintLine } from './formatHintLine'

describe('formatHintLine', () => {
  it('substitutes value placeholder', () => {
    expect(formatHintLine('Wind speed is {value} m/s.', '6')).toBe('Wind speed is 6 m/s.')
  })
})
