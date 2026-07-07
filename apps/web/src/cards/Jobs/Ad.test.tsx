import { type JobAd } from '@repo/types'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { jobAd } from '@/test/fixtures/jobs'
import { renderInTableBody } from '@/test/renderInTable'
import { Ad } from './Ad'

const noop = () => undefined

function renderAd(ad: JobAd, zoom: boolean, editMode = false) {
  return renderInTableBody(
    <Ad
      ad={ad}
      zoom={zoom}
      editMode={editMode}
      onApplied={noop}
      onHide={noop}
      onRestore={noop}
      onFav={noop}
      onUnfav={noop}
    />,
  )
}

describe('Ad', () => {
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
    expect(screen.getByText(/20k — 28k/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/job/1')
  })

  it('shows a green mail-check icon before the title when applied outside edit mode', () => {
    renderAd(jobAd({ id: '3', title: 'Applied Role', applied: true }), true)

    expect(screen.getByLabelText('Złożone')).toBeInTheDocument()
  })

  it('shows a star icon before the title when favourite outside edit mode', () => {
    renderAd(jobAd({ id: '3b', title: 'Favourite Role', fav: true }), true)

    expect(screen.getByLabelText('Ulubione')).toBeInTheDocument()
  })

  it('disables the apply button when the ad is already applied in edit mode', () => {
    renderAd(jobAd({ id: '4', title: 'Already Applied', applied: true }), true, true)

    expect(screen.getByRole('button', { name: 'Oznacz jako złożone' })).toBeDisabled()
  })

  it('shows a restore button for hidden ads in edit mode', () => {
    renderAd(jobAd({ id: '5', title: 'Hidden Role', hide: true }), true, true)

    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/job/1')
    expect(screen.getByRole('button', { name: 'Przywróć ofertę' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ukryj ofertę' })).not.toBeInTheDocument()
  })

  it('keeps action buttons and swaps fav for unfav when favourite in edit mode', () => {
    renderAd(jobAd({ id: '6', title: 'Favourite Role', fav: true }), true, true)

    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/job/1')
    expect(screen.getByRole('button', { name: 'Oznacz jako złożone' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ukryj ofertę' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Usuń z ulubionych' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Dodaj do ulubionych' })).not.toBeInTheDocument()
  })
})
