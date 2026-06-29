import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Graph } from './Graph'
import { HoursBars } from './HoursBars'

describe('HoursBars', () => {
  it('renders nothing without data', () => {
    const { container } = render(<HoursBars highest={30} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a bar for each data point', () => {
    const { container } = render(
      <HoursBars
        data={[
          { hour: 10, value: 15 },
          { hour: 14, value: 30 },
        ]}
        highest={30}
      />,
    )

    expect(container.querySelectorAll('rect')).toHaveLength(2)
  })

  it('colors bars by value when color is true', () => {
    const { container } = render(
      <HoursBars
        data={[
          { hour: 10, value: 15 },
          { hour: 12, value: 21 },
          { hour: 14, value: 30 },
        ]}
        highest={30}
        lowest={15}
        optimal={21}
        color={true}
      />,
    )

    const fills = [...container.querySelectorAll('rect')].map(rect => rect.getAttribute('fill'))
    expect(fills).toEqual(['hsl(240deg 100% 50%', 'hsl(120deg 100% 50%', 'hsl(0deg 100% 50%'])
  })

  it('renders gray bars by default', () => {
    const { container } = render(<HoursBars data={[{ hour: 12, value: 21 }]} highest={30} lowest={15} optimal={21} />)

    expect(container.querySelector('linearGradient')).toBeNull()
    expect(container.querySelector('rect')).toHaveAttribute('fill', 'hsl(0deg 0% 50%)')
  })
})

describe('Graph', () => {
  it('renders min and max labels', () => {
    render(
      <Graph
        data={[
          { datetime: '2026-06-28T11:00:00', value: 10, active: false },
          { datetime: '2026-06-28T10:00:00', value: 20, active: false },
        ]}
        scaleY={5}
        scaleX={1}
      />,
    )

    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })
})
