import { type JobAdsFeedItem } from '@repo/types'
import type { JobAdsChangeStatePayload } from '@repo/types'
import { fetchJobAdCvMatch } from '@repo/feed-client'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jobAd, matchAnalysis, matchAnalysisSummary } from '@/pages/JobMarket/test/fixtures/jobAd'
import { renderInTableBody } from '@/pages/JobMarket/test/renderInTable'
import { Ad } from './Ad'

const noop = async () => undefined

function renderAd(
  ad: JobAdsFeedItem,
  zoom: boolean,
  editMode = false,
  expanded = false,
  onChangeApplicationState: (payload: JobAdsChangeStatePayload) => void = noop,
  onToggleExpand: () => void = noop,
) {
  return renderInTableBody(
    <Ad
      ad={ad}
      zoom={zoom}
      editMode={editMode}
      expanded={expanded}
      onToggleExpand={onToggleExpand}
      onChangeApplicationState={onChangeApplicationState}
      onFav={noop}
      onUnfav={noop}
      onAnalyzeCvMatch={noop}
    />,
  )
}

describe('Ad', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the job title in compact mode', () => {
    renderAd(jobAd({ id: '1', title: 'Senior TypeScript Developer' }), false)

    expect(screen.getByText('Senior TypeScript Developer')).toBeInTheDocument()
    expect(screen.queryByText('nowa')).not.toBeInTheDocument()
    expect(screen.queryByText('[Perm]')).not.toBeInTheDocument()
  })

  it('shows a new tag before the title when published today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-19T12:00:00'))

    renderAd(jobAd({ id: '1a', title: 'Fresh Role', publishedAt: '2026-07-19T08:00:00.000Z' }), false)

    expect(screen.getByText('nowa')).toBeInTheDocument()
    expect(screen.getByText('Fresh Role')).toBeInTheDocument()
  })

  it('does not show a new tag when published before today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-19T12:00:00'))

    renderAd(jobAd({ id: '1b', title: 'Older Role', publishedAt: '2026-07-18T08:00:00.000Z' }), false)

    expect(screen.queryByText('nowa')).not.toBeInTheDocument()
  })

  it('renders extended details and favourite skills when zoomed', () => {
    renderAd(
      jobAd({
        id: '2',
        title: 'Full Stack Engineer',
        employmentType: 'b2b',
        workplaceType: 'hybrid',
        requiredSkills: ['TypeScript', 'Java', 'React'],
        monthlySalaryRangeAfterTaxes: { from: 20_000, to: 28_000 },
      }),
      true,
    )

    expect(screen.getByText(/Full Stack Engineer/)).toBeInTheDocument()
    expect(screen.getByLabelText('Hybrydowo')).toBeInTheDocument()
    expect(screen.queryByText(/\[hybrid\]/)).not.toBeInTheDocument()
    expect(screen.getByText('28.0')).toBeInTheDocument()
    expect(screen.getByText('kPLN')).toBeInTheDocument()
    expect(screen.getByLabelText('B2B')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/job/1')
  })

  it('shows an apply-status icon after the title', () => {
    renderAd(
      jobAd({
        id: '3',
        title: 'Applied Role',
        meta: {
          application: {
            status: 'applied',
            appliedAt: '2026-01-01T00:00:00.000Z',
          },
        },
      }),
      true,
    )

    expect(screen.getByLabelText('Zaaplikowane')).toBeInTheDocument()
  })

  it('shows an apply-status icon in edit mode without opening the editor panel', () => {
    renderAd(
      jobAd({
        id: '3c',
        title: 'Applied Role',
        meta: {
          application: {
            status: 'interview',
            appliedAt: '2026-01-01T00:00:00.000Z',
          },
        },
      }),
      true,
      true,
    )

    expect(screen.getByLabelText('Rozmowa')).toBeInTheDocument()
    expect(screen.queryByLabelText('Nowy status')).not.toBeInTheDocument()
  })

  it('shows a star icon after the title when favourite', () => {
    renderAd(jobAd({ id: '3b', title: 'Favourite Role', meta: { fav: true } }), true)

    expect(screen.getByLabelText('Ulubione')).toBeInTheDocument()
  })

  it('shows a star icon after the title when favourite in edit mode', () => {
    renderAd(jobAd({ id: '3d', title: 'Favourite Role', meta: { fav: true } }), true, true)

    expect(screen.getByLabelText('Ulubione')).toBeInTheDocument()
  })

  it('shows match analysis icon and opens summary dialog', async () => {
    const analysis = matchAnalysis({
      analyzedAt: '2026-01-01T00:00:00.000Z',
      summary: 'Silne dopasowanie do roli TypeScript.',
    })
    vi.mocked(fetchJobAdCvMatch).mockResolvedValue(analysis)

    renderAd(
      jobAd({
        id: '8',
        title: 'Analyzed Role',
        matchAnalysisSummary: matchAnalysisSummary(),
      }),
      true,
    )

    fireEvent.click(screen.getByLabelText('Pokaż analizę dopasowania CV'))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('80%')).toBeInTheDocument()
      expect(screen.getByText('Analiza dopasowania CV — 80%')).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toHaveTextContent('Podsumowanie')
      expect(screen.getByRole('dialog')).toHaveTextContent('Silne dopasowanie do roli TypeScript.')
      expect(screen.getByRole('dialog')).toHaveTextContent('Wnioski')
    })
  })

  it('shows must-have gaps indicator with count when mustHaveGapsCount is greater than zero', () => {
    renderAd(
      jobAd({
        id: '8a',
        title: 'Analyzed Role With Gaps',
        matchAnalysisSummary: matchAnalysisSummary({ mustHaveGapsCount: 2 }),
      }),
      true,
    )

    expect(screen.getByLabelText('2 brakujących wymagań must-have')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByLabelText('Pokaż analizę dopasowania CV')).toBeInTheDocument()
  })

  it('does not show must-have gaps indicator when mustHaveGapsCount is undefined', () => {
    renderAd(
      jobAd({
        id: '8b',
        title: 'Analyzed Role Without Gaps Field',
        matchAnalysisSummary: matchAnalysisSummary(),
      }),
      true,
    )

    expect(screen.queryByLabelText(/brakujących wymagań must-have/)).not.toBeInTheDocument()
  })

  it('shows green checkmark when mustHaveGapsCount is zero', () => {
    renderAd(
      jobAd({
        id: '8c',
        title: 'Analyzed Role With Empty Gaps',
        matchAnalysisSummary: matchAnalysisSummary({ mustHaveGapsCount: 0 }),
      }),
      true,
    )

    expect(screen.getByLabelText('Brak luk must-have')).toBeInTheDocument()
    expect(screen.queryByLabelText(/brakujących wymagań must-have/)).not.toBeInTheDocument()
  })

  it('shows abbreviated applied days after the title in edit mode', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-19T12:00:00'))

    renderAd(
      jobAd({
        id: '7',
        title: 'Applied Role',
        meta: {
          application: {
            status: 'applied',
            appliedAt: '2026-07-13T08:00:00.000Z',
          },
        },
      }),
      true,
      true,
    )

    expect(screen.getByText('6d')).toBeInTheDocument()
  })

  it('does not show abbreviated applied days when the offer was never applied', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-19T12:00:00'))

    renderAd(
      jobAd({
        id: '7b',
        title: 'Open Role',
        meta: {
          application: {
            status: 'pending-review',
            appliedAt: null,
          },
        },
      }),
      true,
      true,
    )

    expect(screen.queryByText('6d')).not.toBeInTheDocument()
  })

  it('shows abbreviated applied days after the title when status moved past applied', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-19T12:00:00'))

    renderAd(
      jobAd({
        id: '7c',
        title: 'Interview Role',
        meta: {
          application: {
            status: 'interview',
            appliedAt: '2026-07-13T08:00:00.000Z',
          },
        },
      }),
      true,
      true,
    )

    expect(screen.getByText('6d')).toBeInTheDocument()
  })

  it('shows an edit button in edit mode', () => {
    renderAd(jobAd({ id: '4', title: 'Editable Role' }), true, true)

    expect(screen.getByRole('button', { name: 'Edytuj aplikację' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Oznacz jako złożone' })).not.toBeInTheDocument()
  })

  it('renders the application editor when expanded in edit mode', () => {
    renderAd(jobAd({ id: '4b', title: 'Expanded Role' }), true, true, true)

    expect(screen.getByText('Obecny status')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zmień stan' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Nowy status')).not.toBeInTheDocument()
  })

  it('does not save without selecting a new status', () => {
    const onChangeApplicationState = vi.fn<(payload: JobAdsChangeStatePayload) => void>()

    renderAd(
      jobAd({ id: '6', title: 'Save Role', meta: { application: { status: 'pending-review' } } }),
      true,
      true,
      true,
      onChangeApplicationState,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zmień stan' }))
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }))

    expect(onChangeApplicationState).not.toHaveBeenCalled()
  })
})
