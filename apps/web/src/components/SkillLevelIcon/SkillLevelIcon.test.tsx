import { describe, expect, it } from 'vitest'
import { SKILL_EXPERIENCE_LEVEL_ORDER } from '@repo/types'
import { renderWithTheme } from '@/test/test-utils'
import { SkillLevelIcon } from './SkillLevelIcon'

describe('SkillLevelIcon', () => {
  it.each(SKILL_EXPERIENCE_LEVEL_ORDER)('renders icon for %s', level => {
    const { container } = renderWithTheme(<SkillLevelIcon level={level} />)

    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
