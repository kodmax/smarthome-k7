import type { PoolConnection } from 'mariadb'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getEndReading } from './getEndReading'
import { getFirstReadingSince } from './getFirstReadingSince'
import { getLatestReading } from './getLatestReading'
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

describe('getEndReading', () => {
  beforeEach(() => {
    vi.mocked(getFirstReadingSince).mockReset()
    vi.mocked(getLatestReading).mockReset()
  })

  it('returns today reading when available', async () => {
    vi.mocked(getFirstReadingSince).mockResolvedValueOnce(todayReading)

    await expect(getEndReading(conn, today, yesterday)).resolves.toEqual(todayReading)
    expect(getFirstReadingSince).toHaveBeenCalledTimes(1)
    expect(getFirstReadingSince).toHaveBeenCalledWith(conn, '2026-07-06 00:00:00')
    expect(getLatestReading).not.toHaveBeenCalled()
  })

  it('falls back to yesterday when today is missing', async () => {
    vi.mocked(getFirstReadingSince).mockResolvedValueOnce(undefined).mockResolvedValueOnce(yesterdayReading)

    await expect(getEndReading(conn, today, yesterday)).resolves.toEqual(yesterdayReading)
    expect(getFirstReadingSince).toHaveBeenNthCalledWith(1, conn, '2026-07-06 00:00:00')
    expect(getFirstReadingSince).toHaveBeenNthCalledWith(2, conn, '2026-07-05 00:00:00')
    expect(getLatestReading).not.toHaveBeenCalled()
  })

  it('falls back to latest reading when today and yesterday are missing', async () => {
    vi.mocked(getFirstReadingSince).mockResolvedValue(undefined)
    vi.mocked(getLatestReading).mockResolvedValue(latestReading)

    await expect(getEndReading(conn, today, yesterday)).resolves.toEqual(latestReading)
    expect(getLatestReading).toHaveBeenCalledWith(conn)
  })

  it('throws when no readings exist', async () => {
    vi.mocked(getFirstReadingSince).mockResolvedValue(undefined)
    vi.mocked(getLatestReading).mockResolvedValue(undefined)

    await expect(getEndReading(conn, today, yesterday)).rejects.toThrow(
      'No hourly energy readings found for end boundary',
    )
  })
})
