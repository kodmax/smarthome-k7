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

  it('renders a gradient with an optimal stop', () => {
    const { container } = render(
      <HoursBars data={[{ hour: 12, value: 21 }]} highest={30} lowest={15} optimal={21} gradient={true} />,
    )

    const stops = container.querySelectorAll('stop')
    expect(stops).toHaveLength(3)
    expect(stops[0]).toHaveAttribute('stop-color', 'hsl(4deg 52% 62%)')
    expect(stops[1]).toHaveAttribute('stop-color', 'hsl(132deg 36% 54%)')
    expect(stops[2]).toHaveAttribute('stop-color', 'hsl(215deg 48% 63%)')
    expect(stops[1]).toHaveAttribute('offset', '60%')
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
