import { describe, expect, it } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { filterJobAdsByRequiredSkills } from './filterJobAdsByRequiredSkills'

describe('filterJobAdsByRequiredSkills', () => {
  const ads = [
    jobAd({ id: '1', title: 'Full stack', requiredSkills: ['TypeScript', 'React', 'PostgreSQL'] }),
    jobAd({ id: '2', title: 'Backend', requiredSkills: ['TypeScript', 'PostgreSQL'] }),
    jobAd({ id: '3', title: 'Frontend', requiredSkills: ['React.js'] }),
    jobAd({ id: '4', title: 'No skills', requiredSkills: [] }),
  ]

  it('returns all ads when no skills selected', () => {
    expect(filterJobAdsByRequiredSkills(ads, []).map(ad => ad.content.id)).toEqual(['1', '2', '3', '4'])
  })

  it('filters by a single skill', () => {
    expect(filterJobAdsByRequiredSkills(ads, ['TypeScript']).map(ad => ad.content.id)).toEqual(['1', '2'])
  })

  it('requires all selected skills', () => {
    expect(filterJobAdsByRequiredSkills(ads, ['TypeScript', 'PostgreSQL']).map(ad => ad.content.id)).toEqual(['1', '2'])
  })

  it('matches skill aliases by id', () => {
    expect(filterJobAdsByRequiredSkills(ads, ['React']).map(ad => ad.content.id)).toEqual(['1', '3'])
  })

  it('excludes ads without required skills when filter is active', () => {
    expect(filterJobAdsByRequiredSkills(ads, ['TypeScript']).some(ad => ad.content.id === '4')).toBe(false)
  })
})
