import { renderWithTheme as render, screen } from '@/test/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { AcceptableSalarySlider } from './AcceptableSalarySlider'

vi.mock('@repo/feed-client', () => ({
  useCommand: vi.fn(() => vi.fn()),
}))

describe('AcceptableSalarySlider', () => {
  it('renders slider with current acceptable salary', () => {
    render(<AcceptableSalarySlider acceptableSalary={24_000} />)

    expect(screen.getByLabelText('Minimalne akceptowalne wynagrodzenie')).toBeInTheDocument()
    expect(screen.getByText('24 k PLN')).toBeInTheDocument()
  })

  it('defaults to 5k when acceptable salary is unset', () => {
    render(<AcceptableSalarySlider acceptableSalary={null} />)

    expect(screen.getByText('5 k PLN')).toBeInTheDocument()
  })

  it('clamps stored salary below slider minimum', () => {
    render(<AcceptableSalarySlider acceptableSalary={3_000} />)

    expect(screen.getByText('5 k PLN')).toBeInTheDocument()
  })
})
