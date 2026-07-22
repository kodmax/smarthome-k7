import { describe, expect, it } from 'vitest'
import { isSkillExperienceLevel, SKILL_EXPERIENCE_LEVEL_ORDER } from './skillExperienceLevel'

describe('isSkillExperienceLevel', () => {
  it.each(SKILL_EXPERIENCE_LEVEL_ORDER)('accepts %s', level => {
    expect(isSkillExperienceLevel(level)).toBe(true)
  })

  it('rejects unknown values', () => {
    expect(isSkillExperienceLevel('novice')).toBe(false)
    expect(isSkillExperienceLevel('')).toBe(false)
    expect(isSkillExperienceLevel(null)).toBe(false)
  })
})
