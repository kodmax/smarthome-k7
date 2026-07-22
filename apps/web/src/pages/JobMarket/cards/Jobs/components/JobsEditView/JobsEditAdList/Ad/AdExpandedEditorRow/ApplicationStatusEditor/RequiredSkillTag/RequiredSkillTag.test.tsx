import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithTheme } from '@/test/test-utils'
import { RequiredSkillTag } from './RequiredSkillTag'

describe('RequiredSkillTag', () => {
  it('renders skill name without icon when my-skill is missing', () => {
    renderWithTheme(<RequiredSkillTag skill='TypeScript' mySkill={undefined} />)

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(document.querySelectorAll('svg')).toHaveLength(0)
  })

  it('renders skill level icon when my-skill is present', () => {
    renderWithTheme(
      <RequiredSkillTag
        skill='TypeScript'
        mySkill={{ id: 'typescript', name: 'TypeScript', level: 'master', comment: null }}
      />,
    )

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(document.querySelector('svg')).toBeInTheDocument()
  })
})
