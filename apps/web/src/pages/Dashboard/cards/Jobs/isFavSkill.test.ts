import { describe, expect, it } from 'vitest'
import { isFavSkill } from './isFavSkill'

describe('isFavSkill', () => {
  it('returns true for favourite skills', () => {
    expect(isFavSkill('TypeScript')).toBe(true)
    expect(isFavSkill('React')).toBe(true)
  })

  it('returns false for other skills', () => {
    expect(isFavSkill('Java')).toBe(false)
    expect(isFavSkill('typescript')).toBe(false)
  })
})
