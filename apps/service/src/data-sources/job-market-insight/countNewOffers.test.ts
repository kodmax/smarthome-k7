import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { countNewOffers } from './countNewOffers'

const makeAd = (publishedAt: string): JobAd => ({
  id: '1',
  origin: 'jj',
  title: 'Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills: [],
  workplaceType: 'remote',
  employmentType: 'permanent',
  publishedAt,
})

describe('countNewOffers', () => {
  const now = new Date('2026-07-20T12:00:00.000Z')

  it('counts ads published within the last 7 days', () => {
    expect(
      countNewOffers(
        [makeAd('2026-07-20T10:00:00.000Z'), makeAd('2026-07-13T12:00:00.000Z'), makeAd('2026-07-12T23:59:59.999Z')],
        now,
      ),
    ).toBe(2)
  })

  it('returns 0 for an empty list', () => {
    expect(countNewOffers([], now)).toBe(0)
  })
})
