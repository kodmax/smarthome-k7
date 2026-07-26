import { describe, expect, it } from 'vitest'
import { formatCommandArgsForLog } from './formatCommandArgsForLog'

describe('formatCommandArgsForLog', () => {
  it('returns short args unchanged', () => {
    expect(formatCommandArgsForLog('on fast')).toBe('on fast')
  })

  it('truncates long args to first 100 chars with total length', () => {
    const args = 'x'.repeat(250)

    expect(formatCommandArgsForLog(args)).toBe(`${'x'.repeat(100)}… (250 chars)`)
  })
})
