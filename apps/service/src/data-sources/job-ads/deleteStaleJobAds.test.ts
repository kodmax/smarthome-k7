import { describe, expect, it } from 'vitest'
import { deleteStaleJobAds } from './jobAdsRepository'
import { mockDeleteResult, mockSql } from '@/test/mockSql'

describe('deleteStaleJobAds', () => {
  it('excludes ads with appliedAt from deletion', async () => {
    const db = mockSql(mockDeleteResult(3))

    const deleted = await deleteStaleJobAds(db, 90)

    expect(deleted).toBe(3)
    expect(db).toHaveBeenCalledTimes(1)

    const [strings] = db.mock.calls[0] as [TemplateStringsArray]
    expect(strings.join(' ')).toContain("data->'meta'->'application'->>'appliedAt' is null")
  })
})
