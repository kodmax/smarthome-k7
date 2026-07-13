import { describe, expect, it } from 'vitest'
import { shouldShowHighUvHint, shouldShowHotOutdoorHint, shouldShowStrongWindHint } from './weatherHints'

describe('shouldShowStrongWindHint', () => {
  it('shows hint at 6 m/s and above', () => {
    expect(shouldShowStrongWindHint(6)).toBe(true)
    expect(shouldShowStrongWindHint(10)).toBe(true)
  })

  it('hides hint below 6 m/s', () => {
    expect(shouldShowStrongWindHint(5.9)).toBe(false)
    expect(shouldShowStrongWindHint(0)).toBe(false)
  })
})

describe('shouldShowHotOutdoorHint', () => {
  it('shows hint at 28°C and above', () => {
    expect(shouldShowHotOutdoorHint(28)).toBe(true)
    expect(shouldShowHotOutdoorHint(35)).toBe(true)
  })

  it('hides hint below 28°C', () => {
    expect(shouldShowHotOutdoorHint(27)).toBe(false)
  })

  it('hides hint when temperature is unknown', () => {
    expect(shouldShowHotOutdoorHint(undefined)).toBe(false)
  })
})

describe('shouldShowHighUvHint', () => {
  it('shows hint at UV 7 and above', () => {
    expect(shouldShowHighUvHint(7)).toBe(true)
    expect(shouldShowHighUvHint(10)).toBe(true)
  })

  it('hides hint below UV 7', () => {
    expect(shouldShowHighUvHint(6.9)).toBe(false)
    expect(shouldShowHighUvHint(undefined)).toBe(false)
  })
})
