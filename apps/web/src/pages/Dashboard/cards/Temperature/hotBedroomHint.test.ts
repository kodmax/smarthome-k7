import { describe, expect, it } from 'vitest'
import { shouldShowHotBedroomHint } from './hotBedroomHint'

describe('shouldShowHotBedroomHint', () => {
  it('shows hint at 28°C and above', () => {
    expect(shouldShowHotBedroomHint(28)).toBe(true)
    expect(shouldShowHotBedroomHint(30)).toBe(true)
  })

  it('hides hint below 28°C', () => {
    expect(shouldShowHotBedroomHint(27.9)).toBe(false)
    expect(shouldShowHotBedroomHint(24)).toBe(false)
  })

  it('hides hint when temperature is unknown', () => {
    expect(shouldShowHotBedroomHint(undefined)).toBe(false)
  })
})
