import { type JobAd } from '@repo/types'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { jobAd } from '@/test/fixtures/jobs'
import { renderInTableBody } from '@/test/renderInTable'
import { Ad } from './Ad'

function renderAd(ad: JobAd, zoom: boolean) {
  return renderInTableBody(<Ad ad={ad} zoom={zoom} />)
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
})
