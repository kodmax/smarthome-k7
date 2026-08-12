import { describe, expect, it } from 'vitest'
import { loadJobAdDedupKeys } from './jobAdsRepository'
import { mockSql } from '@/test/mockSql'

describe('loadJobAdDedupKeys', () => {
  it('maps dedup keys to job ad ids', async () => {
    const db = mockSql([
      {
        id: 'jj-id',
        company_name: 'Acme',
        title: 'React Dev',
      },
    ])

    const keys = await loadJobAdDedupKeys(db)

    expect(keys.get('acme -- REACT DEV')).toBe('jj-id')
  })
})
