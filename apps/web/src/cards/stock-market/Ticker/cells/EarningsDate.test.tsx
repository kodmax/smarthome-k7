import { screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ticker } from '@/test/fixtures/stockMarket'
import { renderInTableRow } from '@/test/renderInTable'
import { EarningsDate } from './EarningsDate'

describe('EarningsDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-28T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when not zoomed', () => {
    const { container } = renderInTableRow(
      <EarningsDate ticker={ticker({ symbol: 'AAA', earningsDate: { confirmed: '2026-07-15' } })} zoom={false} />,
    )

    expect(container.querySelector('td')).not.toBeInTheDocument()
  })

  it('shows days left for an upcoming earnings date within 30 days', () => {
    renderInTableRow(
      <EarningsDate ticker={ticker({ symbol: 'AAA', earningsDate: { confirmed: '2026-07-15' } })} zoom={true} />,
    )

    expect(screen.getByText(/17d/)).toBeInTheDocument()
  })
})
