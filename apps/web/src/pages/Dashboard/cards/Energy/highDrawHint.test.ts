import { describe, expect, it } from 'vitest'
import { shouldShowHighDrawHint } from './highDrawHint'

describe('shouldShowHighDrawHint', () => {
  it('shows hint at 1000 W and above', () => {
    expect(shouldShowHighDrawHint(1000)).toBe(true)
    expect(shouldShowHighDrawHint(1500)).toBe(true)
  })

  it('hides hint below 1000 W', () => {
    expect(shouldShowHighDrawHint(999)).toBe(false)
    expect(shouldShowHighDrawHint(400)).toBe(false)
  })

  it('hides hint when draw is unknown', () => {
    expect(shouldShowHighDrawHint(undefined)).toBe(false)
  })
})
