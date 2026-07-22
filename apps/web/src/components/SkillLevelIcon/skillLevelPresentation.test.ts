import { describe, expect, it } from 'vitest'
import { designTokens } from '@repo/design-tokens'
import { SKILL_EXPERIENCE_LEVEL_ORDER } from '@repo/types'
import { Ban, History, Plus, Star } from 'lucide-react'
import { SKILL_LEVEL_COLORS, SKILL_LEVEL_ICONS } from './skillLevelPresentation'

describe('skillLevelPresentation', () => {
  it.each(SKILL_EXPERIENCE_LEVEL_ORDER)('defines icon and color for %s', level => {
    expect(SKILL_LEVEL_ICONS[level]).toBeDefined()
    expect(SKILL_LEVEL_COLORS[level]).toBeTruthy()
  })

  it('uses star icons for experience tiers', () => {
    expect(SKILL_LEVEL_ICONS.adept).toBe(Star)
    expect(SKILL_LEVEL_ICONS.regular).toBe(Star)
    expect(SKILL_LEVEL_ICONS.master).toBe(Star)
  })

  it('uses plus for to-learn, history for knew-before, and ban for not-interested', () => {
    expect(SKILL_LEVEL_ICONS['to-learn']).toBe(Plus)
    expect(SKILL_LEVEL_ICONS['knew-before']).toBe(History)
    expect(SKILL_LEVEL_ICONS['not-interested']).toBe(Ban)
  })

  it('uses knew-before color from design tokens', () => {
    expect(SKILL_LEVEL_COLORS['knew-before']).toBe(designTokens.skillLevel.knewBefore.color)
  })

  it('uses distinct colors for star tiers from design tokens', () => {
    expect(SKILL_LEVEL_COLORS.adept).toBe(designTokens.skillLevel.adept)
    expect(SKILL_LEVEL_COLORS.regular).toBe(designTokens.skillLevel.regular.color)
    expect(SKILL_LEVEL_COLORS.master).toBe(designTokens.skillLevel.master.color)
  })
})
