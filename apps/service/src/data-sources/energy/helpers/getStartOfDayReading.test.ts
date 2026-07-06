import type { PoolConnection } from 'mariadb'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getFirstReadingSince } from './getFirstReadingSince'
import { getLatestReading } from './getLatestReading'
import { getStartOfDayReading } from './getStartOfDayReading'
import type { HourlyReading } from './types'

vi.mock('./getFirstReadingSince', () => ({
  getFirstReadingSince: vi.fn(),
}))

vi.mock('./getLatestReading', () => ({
  getLatestReading: vi.fn(),
}))

const conn = {} as PoolConnection
const today = '2026-07-06'
const yesterday = '2026-07-05'

const todayReading: HourlyReading = {
  datetime: '2026-07-06T00:00:00Z',
  hour_start_reading: 17_399_885,
}

const yesterdayReading: HourlyReading = {
  datetime: '2026-07-05T00:00:00Z',
  hour_start_reading: 17_390_322,
}

const latestReading: HourlyReading = {
  datetime: '2026-07-06T20:00:00Z',
  hour_start_reading: 17_405_000,
}

describe('getStartOfDayReading', () => {
  beforeEach(() => {
    vi.mocked(getFirstReadingSince).mockReset()
    vi.mocked(getLatestReading).mockReset()
  })

  it('returns today hour_start_reading when available', async () => {
    vi.mocked(getFirstReadingSince).mockResolvedValueOnce(todayReading)

    await expect(getStartOfDayReading(conn, today, yesterday)).resolves.toBe(17_399_885)
    expect(getLatestReading).not.toHaveBeenCalled()
  })

  it('falls back to yesterday when today is missing', async () => {
    vi.mocked(getFirstReadingSince).mockResolvedValueOnce(undefined).mockResolvedValueOnce(yesterdayReading)

    await expect(getStartOfDayReading(conn, today, yesterday)).resolves.toBe(17_390_322)
    expect(getLatestReading).not.toHaveBeenCalled()
  })

  it('falls back to latest reading when today and yesterday are missing', async () => {
    vi.mocked(getFirstReadingSince).mockResolvedValue(undefined)
    vi.mocked(getLatestReading).mockResolvedValue(latestReading)

    await expect(getStartOfDayReading(conn, today, yesterday)).resolves.toBe(17_405_000)
  })

  it('throws when no readings exist', async () => {
    vi.mocked(getFirstReadingSince).mockResolvedValue(undefined)
    vi.mocked(getLatestReading).mockResolvedValue(undefined)

    await expect(getStartOfDayReading(conn, today, yesterday)).rejects.toThrow(
      'No hourly energy readings found for start of day',
    )
  })
})
