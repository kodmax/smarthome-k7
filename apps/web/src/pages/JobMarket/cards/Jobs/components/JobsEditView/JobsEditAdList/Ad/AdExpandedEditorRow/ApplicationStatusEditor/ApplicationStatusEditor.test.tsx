import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobs'
import { renderWithTheme } from '@/test/test-utils'
import { ApplicationStatusEditor } from './ApplicationStatusEditor'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
}))

const mockedUseFeed = vi.mocked(useFeed)

describe('ApplicationStatusEditor', () => {
  beforeEach(() => {
    mockedUseFeed.mockReturnValue(undefined)
  })
  it('toggles favourite state immediately', () => {
    const onFav = vi.fn()
    const onUnfav = vi.fn()

    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '1', title: 'Role', meta: { fav: false } })}
        onSave={vi.fn()}
        onFav={onFav}
        onUnfav={onUnfav}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Dodaj do ulubionych' }))

    expect(onFav).toHaveBeenCalledWith('1')
    expect(onUnfav).not.toHaveBeenCalled()
  })

  it('shows read-only application details until change status is clicked', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '2',
          title: 'Role',
          meta: {
            application: {
              status: 'applied',
              comment: 'Existing note',
              appliedAt: '2026-07-16T08:00:00.000Z',
              statusChangedAt: '2026-07-18T08:00:00.000Z',
            },
          },
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
      />,
    )

    expect(screen.getByText('Firma')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Obecny status')).toBeInTheDocument()
    expect(screen.getByText('Data zaaplikowania')).toBeInTheDocument()
    expect(screen.getByText('Ostatnia zmiana statusu')).toBeInTheDocument()
    expect(screen.getByText('Wymagane umiejętności')).toBeInTheDocument()
    expect(screen.getAllByText('Zaaplikowane').length).toBeGreaterThan(0)
    expect(screen.getByText('Komentarz')).toBeInTheDocument()
    expect(screen.getByText('Existing note')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zmień stan' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Nowy status')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Zapisz' })).not.toBeInTheDocument()
  })

  it('shows required skills from the ad', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '6',
          title: 'Role',
          requiredSkills: ['TypeScript', 'React', 'shadcn'],
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
      />,
    )

    expect(screen.getByText('Wymagane umiejętności')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('shadcn')).toBeInTheDocument()
  })

  it('matches required skills to my-skills by normalized id', () => {
    mockedUseFeed.mockReturnValue({
      skills: [{ id: 'typescript', name: 'TypeScript', level: 'master', comment: null }],
    })

    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '8',
          title: 'Role',
          requiredSkills: ['TypeScript'],
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
      />,
    )

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('shows n/d when the ad has no required skills', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '7', title: 'Role', requiredSkills: [] })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
      />,
    )

    const requiredSkillsSection = screen.getByText('Wymagane umiejętności').parentElement

    expect(requiredSkillsSection).toHaveTextContent('n/d')
  })

  it('shows n/d when the application has no appliedAt date', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '4',
          title: 'Role',
          meta: { application: { status: 'not-applied', statusChangedAt: null } },
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
      />,
    )

    expect(screen.getByText('Ostatnia zmiana statusu')).toBeInTheDocument()
    expect(screen.getAllByText('n/d').length).toBeGreaterThanOrEqual(2)
  })

  it('reveals edit controls after clicking change status', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '3', title: 'Role', meta: { application: { status: 'not-applied' } } })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))

    expect(screen.getByLabelText('Nowy status')).toBeInTheDocument()
    expect(screen.getByLabelText('Komentarz')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Zapisz' })).toBeDisabled()
  })

  it('submits the selected status and trimmed comment', () => {
    const onSave = vi.fn()

    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '3', title: 'Role', meta: { application: { status: 'not-applied' } } })}
        onSave={onSave}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Nowy status' }))
    fireEvent.click(screen.getByRole('option', { name: 'Zaaplikowane' }))
    fireEvent.change(screen.getByLabelText('Komentarz'), { target: { value: '  CV sent  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }))

    expect(onSave).toHaveBeenCalledWith('applied', 'CV sent')
  })

  it('returns to read-only view when change is cancelled', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '5', title: 'Role', meta: { application: { status: 'applied' } } })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))
    expect(screen.getByLabelText('Nowy status')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Anuluj' }))

    expect(screen.queryByLabelText('Nowy status')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zmień stan' })).toBeInTheDocument()
  })
})
