import { describe, expect, it } from 'vitest'
import { mockSql } from '@/test/mockSql'
import { loadJobMarketInsightSnapshotsInRange } from './loadJobMarketInsightSnapshotsInRange'

describe('loadJobMarketInsightSnapshotsInRange', () => {
  it('returns parsed metrics ordered by snapshot date', async () => {
    const db = mockSql([
      {
        metrics: {
          adsCount: 10,
          newOffersCount: 1,
          medianSalary: 1,
          p90Salary: 1,
          p90OffersCount: 1,
          offersWithSalaryRangePercent: 1,
          remoteWorkPercent: 1,
          hybridWorkPercent: 1,
          officeWorkPercent: 1,
          permanentEmploymentPercent: 1,
        },
      },
      {
        metrics: JSON.stringify({
          adsCount: 20,
          newOffersCount: 2,
          medianSalary: 2,
          p90Salary: 2,
          p90OffersCount: 2,
          offersWithSalaryRangePercent: 2,
          remoteWorkPercent: 2,
          hybridWorkPercent: 2,
          officeWorkPercent: 2,
          permanentEmploymentPercent: 2,
        }),
      },
    ])

    const snapshots = await loadJobMarketInsightSnapshotsInRange(db, '2026-06-01', '2026-06-07')

    expect(snapshots).toHaveLength(2)
    expect(snapshots[0].adsCount).toBe(10)
    expect(snapshots[1].adsCount).toBe(20)
  })

  it('returns an empty array when no snapshots exist', async () => {
    const db = mockSql([])

    await expect(loadJobMarketInsightSnapshotsInRange(db, '2026-06-01', '2026-06-07')).resolves.toEqual([])
  })
})
