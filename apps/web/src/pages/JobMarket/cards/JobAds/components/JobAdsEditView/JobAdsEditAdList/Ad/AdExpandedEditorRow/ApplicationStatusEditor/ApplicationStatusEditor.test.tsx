import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeed } from '@repo/feed-client'
import { jobAd, matchAnalysis } from '@/pages/JobMarket/test/fixtures/jobAd'
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
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Dodaj do ulubionych' }))

    expect(onFav).toHaveBeenCalledWith('1')
    expect(onUnfav).not.toHaveBeenCalled()
  })

  it('shows rejection date when rejectedAt is set, even after archiving', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '9',
          title: 'Role',
          meta: {
            application: {
              status: 'archived',
              archiveReason: 'rejected',
              appliedAt: '2026-07-07T20:59:24.000Z',
              rejectedAt: '2026-07-20T06:27:50.000Z',
              statusChangedAt: '2026-07-22T20:55:49.000Z',
            },
          },
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    expect(screen.getByText('Data zaaplikowania')).toBeInTheDocument()
    expect(screen.getByText('Data odrzucenia')).toBeInTheDocument()
    expect(screen.queryByText('Ostatnia zmiana')).not.toBeInTheDocument()
  })

  it('does not show rejection date when rejectedAt is missing', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '10',
          title: 'Role',
          meta: {
            application: {
              status: 'applied',
              appliedAt: '2026-07-16T08:00:00.000Z',
              rejectedAt: null,
              statusChangedAt: '2026-07-18T08:00:00.000Z',
            },
          },
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    expect(screen.queryByText('Data odrzucenia')).not.toBeInTheDocument()
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
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    expect(screen.getByText('Firma')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Obecny status')).toBeInTheDocument()
    expect(screen.getByText('Data zaaplikowania')).toBeInTheDocument()
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
        onAnalyzeCvMatch={vi.fn()}
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
        onAnalyzeCvMatch={vi.fn()}
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
        onAnalyzeCvMatch={vi.fn()}
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
          meta: { application: { status: 'pending-review', statusChangedAt: null } },
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    expect(screen.getAllByText('n/d').length).toBeGreaterThanOrEqual(1)
  })

  it('reveals edit controls after clicking change status', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '3', title: 'Role', meta: { application: { status: 'pending-review' } } })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))

    expect(screen.getByLabelText('Nowy status')).toBeInTheDocument()
    expect(screen.getByLabelText('Komentarz')).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Zapisz' })).toBeDisabled()
  })

  it('submits comment without changing status', () => {
    const onSave = vi.fn()

    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '14',
          title: 'Role',
          meta: { application: { status: 'no-response', comment: 'Follow-up sent' } },
        })}
        onSave={onSave}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))
    fireEvent.change(screen.getByLabelText('Komentarz'), { target: { value: 'Second follow-up sent' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }))

    expect(onSave).toHaveBeenCalledWith({
      applyStatus: 'no-response',
      comment: 'Second follow-up sent',
    })
  })

  it('does not list the current status or archive reasons in next status options', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '15', title: 'Role', meta: { application: { status: 'no-response' } } })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Nowy status' }))

    expect(screen.queryByRole('option', { name: 'Brak odpowiedzi' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Odrzucone' })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Zarchiwizowane' })).toBeInTheDocument()
  })

  it('requires archive reason when archiving', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '17', title: 'Role', meta: { application: { status: 'no-response' } } })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Nowy status' }))
    fireEvent.click(screen.getByRole('option', { name: 'Zarchiwizowane' }))

    expect(screen.getByLabelText('Powód archiwizacji')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zapisz' })).toBeDisabled()
  })

  it('submits archived status with selected archive reason', () => {
    const onSave = vi.fn()

    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '18', title: 'Role', meta: { application: { status: 'no-response' } } })}
        onSave={onSave}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Nowy status' }))
    fireEvent.click(screen.getByRole('option', { name: 'Zarchiwizowane' }))
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Powód archiwizacji' }))
    fireEvent.click(screen.getByRole('option', { name: 'Odrzucone' }))
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }))

    expect(onSave).toHaveBeenCalledWith({
      applyStatus: 'archived',
      archiveReason: 'rejected',
      comment: '',
    })
  })

  it('allows comment-only editing and unarchive options for archived ads', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '16',
          title: 'Role',
          meta: { application: { status: 'archived', archiveReason: 'not-interested', comment: 'Old note' } },
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))

    expect(screen.getByLabelText('Nowy status')).toBeInTheDocument()
    expect(screen.getByLabelText('Komentarz')).toHaveValue('Old note')
  })

  it('submits the selected status and trimmed comment', () => {
    const onSave = vi.fn()

    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '3', title: 'Role', meta: { application: { status: 'pending-review' } } })}
        onSave={onSave}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Nowy status' }))
    fireEvent.click(screen.getByRole('option', { name: 'Zaaplikowane' }))
    fireEvent.change(screen.getByLabelText('Komentarz'), { target: { value: '  CV sent  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }))

    expect(onSave).toHaveBeenCalledWith({
      applyStatus: 'applied',
      comment: 'CV sent',
    })
  })

  it('disables check cv match for theprotocol ads', () => {
    const onAnalyzeCvMatch = vi.fn()

    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: 'tp-1', title: 'Role', origin: 'theprotocol' })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={onAnalyzeCvMatch}
      />,
    )

    const button = screen.getByRole('button', { name: 'Sprawdź dopasowanie' })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onAnalyzeCvMatch).not.toHaveBeenCalled()
  })

  it('disables check cv match when analysis is current', () => {
    const onAnalyzeCvMatch = vi.fn()

    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '12',
          title: 'Role',
          matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-01T00:00:00.000Z' }),
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={onAnalyzeCvMatch}
      />,
    )

    const button = screen.getByRole('button', { name: 'Sprawdź dopasowanie' })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onAnalyzeCvMatch).not.toHaveBeenCalled()
  })

  it('enables check cv match when analysis is stale', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '13',
          title: 'Role',
          matchAnalysis: matchAnalysis({ analyzedAt: '2026-01-01T00:00:00.000Z' }),
          meta: { isCurrentCVUsed: false },
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Sprawdź dopasowanie' })).toBeEnabled()
  })

  it('shows loader and opens match analysis dialog after ad update', async () => {
    const feedAd = jobAd({ id: '11', title: 'Role' })
    const onAnalyzeCvMatch = vi.fn()

    const { rerender } = renderWithTheme(
      <ApplicationStatusEditor
        ad={feedAd}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={onAnalyzeCvMatch}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sprawdź dopasowanie' }))

    expect(onAnalyzeCvMatch).toHaveBeenCalledWith('11')
    expect(screen.getByRole('button', { name: 'Sprawdź dopasowanie' })).toBeDisabled()

    const updatedAnalysis = matchAnalysis({
      analyzedAt: '2026-01-02T00:00:00.000Z',
      summary: 'Dobre dopasowanie do roli.',
    })

    rerender(
      <ApplicationStatusEditor
        ad={jobAd({
          id: '11',
          title: 'Role',
          matchAnalysis: updatedAnalysis,
        })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={onAnalyzeCvMatch}
      />,
    )

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.getByText('Analiza dopasowania CV — 80%')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveTextContent('Podsumowanie')
    expect(screen.getByRole('dialog')).toHaveTextContent('Dobre dopasowanie do roli.')
    expect(screen.getByRole('dialog')).toHaveTextContent('Wnioski')
    expect(screen.getByRole('button', { name: 'Sprawdź dopasowanie', hidden: true })).toBeDisabled()
  })

  it('returns to read-only view when change is cancelled', () => {
    renderWithTheme(
      <ApplicationStatusEditor
        ad={jobAd({ id: '5', title: 'Role', meta: { application: { status: 'applied' } } })}
        onSave={vi.fn()}
        onFav={vi.fn()}
        onUnfav={vi.fn()}
        onAnalyzeCvMatch={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))
    expect(screen.getByLabelText('Nowy status')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Anuluj' }))

    expect(screen.queryByLabelText('Nowy status')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zmień stan' })).toBeInTheDocument()
  })
})
