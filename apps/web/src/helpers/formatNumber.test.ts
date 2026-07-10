import { describe, expect, it } from 'vitest'
import { formatNumber, getNumberFormatSeparators } from './formatNumber'

describe('getNumberFormatSeparators', () => {
  it('reads group and decimal separators from the locale', () => {
    expect(getNumberFormatSeparators('pl-PL')).toEqual({
      group: ' ',
      decimal: ',',
    })
  })
})

describe('formatNumber', () => {
  const { group, decimal } = getNumberFormatSeparators()

  it('formats thousands with locale grouping and fixed decimal places', () => {
    expect(formatNumber(1234567.8, { fractionDigits: 2 })).toBe(`1${group}234${group}567${decimal}80`)
  })

  it('rounds to the requested number of decimal places', () => {
    expect(formatNumber(0.156, { fractionDigits: 2 })).toBe(`0${decimal}16`)
    expect(formatNumber(127.4, { fractionDigits: 0 })).toBe('127')
    expect(formatNumber(127.6, { fractionDigits: 0 })).toBe('128')
  })

  it('formats using significant digits when precision is provided', () => {
    expect(formatNumber(12345, { precision: 3 })).toBe(`12${group}300`)
    expect(formatNumber(0.001234, { precision: 2 })).toBe(`0${decimal}0012`)
  })

  it('prefers fractionDigits when both options are provided', () => {
    expect(formatNumber(1234.567, { fractionDigits: 2, precision: 1 })).toBe(`1${group}234${decimal}57`)
  })

  it('formats without forced decimals when no precision option is given', () => {
    expect(formatNumber(1234.5)).toBe(`1${group}234${decimal}5`)
    expect(formatNumber(1234)).toBe(`1${group}234`)
  })

  it('supports negative numbers', () => {
    expect(formatNumber(-1234.5, { fractionDigits: 1 })).toBe(`-1${group}234${decimal}5`)
  })

  it('returns non-finite values as strings', () => {
    expect(formatNumber(Number.NaN)).toBe('NaN')
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('Infinity')
  })

  it('respects a custom locale', () => {
    expect(formatNumber(1234.5, { locale: 'en-US', fractionDigits: 1 })).toBe('1,234.5')
  })
})
