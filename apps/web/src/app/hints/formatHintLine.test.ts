import { describe, expect, it } from 'vitest'
import { formatHintLine } from './formatHintLine'

describe('formatHintLine', () => {
  it('substitutes a string value placeholder', () => {
    expect(formatHintLine('Wind speed is {value} m/s.', '6')).toBe('Wind speed is 6 m/s.')
  })

  it('formats numeric values with formatNumber', () => {
    expect(formatHintLine('Chwilowy pobór wynosi {value} W.', 1500, 0)).toBe('Chwilowy pobór wynosi 1 500 W.')
  })

  it('supports fractional digits for numeric values', () => {
    expect(formatHintLine('Indeks UV wynosi {value}.', 7.4, 1)).toBe('Indeks UV wynosi 7,4.')
  })
})
