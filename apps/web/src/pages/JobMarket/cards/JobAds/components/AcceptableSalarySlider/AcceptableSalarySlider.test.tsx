import { renderWithTheme as render, screen } from '@/test/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { AcceptableSalarySlider } from './AcceptableSalarySlider'

vi.mock('@repo/feed-client', () => ({
  useCommand: vi.fn(() => vi.fn()),
}))

describe('AcceptableSalarySlider', () => {
  it('renders nothing when salary range is unavailable', () => {
    const { container } = render(<AcceptableSalarySlider salaryRange={null} acceptableSalary={null} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders slider with current acceptable salary', () => {
    render(<AcceptableSalarySlider salaryRange={{ min: 15_000, max: 35_000 }} acceptableSalary={24_000} />)

    expect(screen.getByLabelText('Minimalne akceptowalne wynagrodzenie')).toBeInTheDocument()
    expect(screen.getByText('>= 24 k PLN')).toBeInTheDocument()
  })

  it('defaults to salary range min when acceptable salary is unset', () => {
    render(<AcceptableSalarySlider salaryRange={{ min: 15_000, max: 35_000 }} acceptableSalary={null} />)

    expect(screen.getByText('>= 15 k PLN')).toBeInTheDocument()
  })
})
