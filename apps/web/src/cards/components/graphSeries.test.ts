import { describe, expect, it } from 'vitest'
import { buildGraphSeries } from './graphSeries'

const now = new Date('2026-06-28T12:00:00').getTime()

describe('buildGraphSeries', () => {
  it('returns min, max and point coordinates for recent data', () => {
    const series = buildGraphSeries(
      [
        { datetime: '2026-06-28T11:00:00', value: 10, heating: true },
        { datetime: '2026-06-28T10:00:00', value: 20, heating: false },
      ],
      5,
      1,
      now,
    )

    expect(series.min).toBe(10)
    expect(series.max).toBe(20)
    expect(series.points.split(' ')).toHaveLength(2)
    expect(series.actives).toHaveLength(1)
    expect(series.stroke).toBe('hsl(0deg 100% 50%)')
  })

  it('uses the neutral stroke when spread stays within scaleY', () => {
    const series = buildGraphSeries([{ datetime: '2026-06-28T11:30:00', value: 10, heating: false }], 20, 1, now)

    expect(series.stroke).toBe('hsl(0deg 0% 20%)')
  })

  it('excludes points older than the visible window', () => {
    const series = buildGraphSeries([{ datetime: '2026-06-20T12:00:00', value: 10, heating: false }], 5, 1, now)

    expect(series.points).toBe('')
  })
})
