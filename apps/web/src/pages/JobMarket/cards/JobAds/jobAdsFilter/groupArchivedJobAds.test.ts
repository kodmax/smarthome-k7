import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { groupArchivedJobAdsByReason } from './groupArchivedJobAds'

describe('groupArchivedJobAdsByReason', () => {
  it('groups archived ads by archive reason in defined order', () => {
    const ads = [
      jobAd({
        id: '1',
        title: 'Rejected Role',
        meta: { application: { status: 'archived', archiveReason: 'rejected' } },
      }),
      jobAd({
        id: '2',
        title: 'Not Interested Role',
        meta: { application: { status: 'archived', archiveReason: 'other' } },
      }),
      jobAd({
        id: '3',
        title: 'Another Rejected Role',
        meta: { application: { status: 'archived', archiveReason: 'rejected' } },
      }),
    ]

    expect(groupArchivedJobAdsByReason(ads)).toEqual([
      {
        archiveReason: 'other',
        ads: [ads[1]],
      },
      {
        archiveReason: 'rejected',
        ads: [ads[0], ads[2]],
      },
    ])
  })

  it('omits empty groups and ads without archive reason', () => {
    const ads = [
      jobAd({
        id: '1',
        title: 'Invalid Archived Role',
        meta: { application: { status: 'archived', archiveReason: null } },
      }),
      jobAd({
        id: '2',
        title: 'Withdrawn Role',
        meta: { application: { status: 'archived', archiveReason: 'withdrawn' } },
      }),
    ]

    expect(groupArchivedJobAdsByReason(ads)).toEqual([
      {
        archiveReason: 'withdrawn',
        ads: [ads[1]],
      },
    ])
  })
})
