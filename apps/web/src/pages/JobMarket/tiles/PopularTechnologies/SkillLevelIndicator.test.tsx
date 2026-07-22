import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithTheme } from '@/test/test-utils'
import { SkillLevelIndicator } from './SkillLevelIndicator'

describe('SkillLevelIndicator', () => {
  it('renders with level aria label', () => {
    renderWithTheme(<SkillLevelIndicator level='master' comment={null} />)

    expect(screen.getByLabelText('Master')).toBeInTheDocument()
  })

  it('renders with comment in tooltip title', () => {
    renderWithTheme(<SkillLevelIndicator level='regular' comment='Daily driver' />)

    expect(screen.getByLabelText('Regular')).toBeInTheDocument()
  })
})
