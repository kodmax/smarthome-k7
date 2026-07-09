import { describe, expect, it } from 'vitest'
import { formatMarketDuration } from './formatMarketDuration'

describe('formatMarketDuration', () => {
  it('shows seconds only below one minute', () => {
    expect(formatMarketDuration(45_000)).toBe('45s')
    expect(formatMarketDuration(0)).toBe('0s')
  })

  it('omits seconds at one minute and above', () => {
    expect(formatMarketDuration(60_000)).toBe('1m')
    expect(formatMarketDuration(90_000)).toBe('1m')
    expect(formatMarketDuration(3_661_000)).toBe('1g 1m')
    expect(formatMarketDuration(90_061_000)).toBe('1d 1g 1m')
  })
})
