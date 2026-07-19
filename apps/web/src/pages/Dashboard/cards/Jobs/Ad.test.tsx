import { type JobAdWithMeta, type JobApplyStatus } from '@repo/types'
import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jobAd } from '@/pages/Dashboard/test/fixtures/jobs'
import { renderInTableBody } from '@/pages/Dashboard/test/renderInTable'
import { Ad } from './Ad'

const noop = () => undefined

function renderAd(
  ad: JobAdWithMeta,
  zoom: boolean,
  editMode = false,
  expanded = false,
  onChangeApplicationState: (id: string, applyStatus: JobApplyStatus, comment: string) => void = noop,
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
    expect(screen.queryByText('[Perm]')).not.toBeInTheDocument()
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
    expect(screen.getByText(/\[B2B\]/)).toBeInTheDocument()
    expect(screen.getByText(/\[hybrid\]/)).toBeInTheDocument()
    expect(screen.getByText('[TypeScript]')).toBeInTheDocument()
    expect(screen.getByText('[React]')).toBeInTheDocument()
    expect(screen.queryByText('[Java]')).not.toBeInTheDocument()
    expect(screen.getByText('20 — 28')).toBeInTheDocument()
    expect(screen.getByText('kPLN')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/job/1')
  })

  it('shows an apply-status icon before the title', () => {
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

    expect(screen.getByLabelText('Złożone')).toBeInTheDocument()
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

  it('shows a star icon before the title when favourite', () => {
    renderAd(jobAd({ id: '3b', title: 'Favourite Role', meta: { fav: true } }), true)

    expect(screen.getByLabelText('Ulubione')).toBeInTheDocument()
  })

  it('shows a star icon before the title when favourite in edit mode', () => {
    renderAd(jobAd({ id: '3d', title: 'Favourite Role', meta: { fav: true } }), true, true)

    expect(screen.getByLabelText('Ulubione')).toBeInTheDocument()
  })

  it('shows abbreviated applied days before the title in edit mode', () => {
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

  it('does not show abbreviated applied days outside edit mode', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-19T12:00:00'))

    renderAd(
      jobAd({
        id: '7b',
        title: 'Applied Role',
        meta: {
          application: {
            status: 'applied',
            appliedAt: '2026-07-13T08:00:00.000Z',
          },
        },
      }),
      true,
    )

    expect(screen.queryByText('6d')).not.toBeInTheDocument()
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
    const onChangeApplicationState = vi.fn<(id: string, applyStatus: JobApplyStatus, comment: string) => void>()

    renderAd(
      jobAd({ id: '6', title: 'Save Role', meta: { application: { status: 'not-applied' } } }),
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
