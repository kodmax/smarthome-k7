import { describe, expect, it } from 'vitest'
import { convertMarketCap } from './convertToBillions'

describe('convertMarketCap', () => {
  it('converts trillions to billions', () => {
    expect(convertMarketCap('2.5T')).toBe(2500)
  })

  it('keeps billions as-is', () => {
    expect(convertMarketCap('150.3B')).toBe(150.3)
  })

  it('converts millions to billions by default', () => {
    expect(convertMarketCap('500M')).toBe(0.5)
  })
})
