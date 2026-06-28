import { describe, expect, it } from 'vitest'
import { toNumber } from './toNumber'

describe('toNumber', () => {
  it('parses plain numbers', () => {
    expect(toNumber('1234')).toBe(1234)
  })

  it('removes comma separators', () => {
    expect(toNumber('1,234,567')).toBe(1234567)
  })

  it('parses decimal values', () => {
    expect(toNumber('1,234.56')).toBe(1234.56)
  })
})
