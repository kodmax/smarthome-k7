import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithTheme } from '@/test/test-utils'
import { SkillExperienceEditor } from './SkillExperienceEditor'

describe('SkillExperienceEditor', () => {
  it('calls onLevelChange when knew-before is selected', () => {
    const onLevelChange = vi.fn()

    renderWithTheme(
      <SkillExperienceEditor level={null} initialComment='' onLevelChange={onLevelChange} onCommentBlur={vi.fn()} />,
    )

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Moje doświadczenie' }))
    fireEvent.click(screen.getByRole('option', { name: 'Znałem kiedyś' }))

    expect(onLevelChange).toHaveBeenCalledWith('knew-before')
  })

  it('calls onLevelChange when a level is selected', () => {
    const onLevelChange = vi.fn()

    renderWithTheme(
      <SkillExperienceEditor
        level={null}
        initialComment='Existing note'
        onLevelChange={onLevelChange}
        onCommentBlur={vi.fn()}
      />,
    )

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Moje doświadczenie' }))
    fireEvent.click(screen.getByRole('option', { name: 'Chcę się nauczyć' }))

    expect(onLevelChange).toHaveBeenCalledWith('to-learn')
  })

  it('prefills the comment field from initialComment', () => {
    renderWithTheme(
      <SkillExperienceEditor
        level='regular'
        initialComment='Saved note'
        onLevelChange={vi.fn()}
        onCommentBlur={vi.fn()}
      />,
    )

    expect(screen.getByRole('textbox', { name: 'Komentarz' })).toHaveValue('Saved note')
  })

  it('calls onCommentBlur with trimmed comment', () => {
    const onCommentBlur = vi.fn()

    renderWithTheme(
      <SkillExperienceEditor level='master' initialComment='' onLevelChange={vi.fn()} onCommentBlur={onCommentBlur} />,
    )

    fireEvent.change(screen.getByRole('textbox', { name: 'Komentarz' }), {
      target: { value: '  Daily driver  ' },
    })
    fireEvent.blur(screen.getByRole('textbox', { name: 'Komentarz' }))

    expect(onCommentBlur).toHaveBeenCalledWith('Daily driver')
  })
})
