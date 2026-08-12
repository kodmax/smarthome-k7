import { describe, expect, it } from 'vitest'
import { loadNotInterestedSkillIds } from './loadNotInterestedSkillIds'
import { mockSql } from '@/test/mockSql'

describe('loadNotInterestedSkillIds', () => {
  it('returns skill ids marked as not-interested', async () => {
    const db = mockSql([{ skill_id: 'java' }, { skill_id: 'php' }])

    const ids = await loadNotInterestedSkillIds(db)

    expect(ids).toEqual(new Set(['java', 'php']))
  })

  it('returns empty set when no not-interested skills exist', async () => {
    const db = mockSql([])

    const ids = await loadNotInterestedSkillIds(db)

    expect(ids).toEqual(new Set())
  })
})
