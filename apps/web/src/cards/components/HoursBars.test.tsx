import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Graph } from './Graph'
import { HoursBars } from './HoursBars'

describe('HoursBars', () => {
  it('renders nothing without data', () => {
    const { container } = render(<HoursBars positiveMax={30} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a bar for each data point', () => {
    const { container } = render(
      <HoursBars
        data={[
          { hour: 10, value: 15 },
          { hour: 14, value: 30 },
        ]}
        positiveMax={30}
      />,
    )

    expect(container.querySelectorAll('rect')).toHaveLength(2)
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
