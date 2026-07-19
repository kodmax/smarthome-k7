import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { isHybridOrRemote, isSalaryAcceptable, notManager, noUwantedSkills, withReact } from './filters'

const baseAd: JobAd = {
  id: '1',
  origin: 'jj',
  title: 'Senior React Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills: ['React', 'TypeScript'],
  workplaceType: 'remote',
  employmentType: 'permanent',
  applied: false,
  hide: false,
  fav: false,
  monthlySalaryRangeAfterTaxes: { from: 26_000, to: 30_000 },
}

describe('noUwantedSkills', () => {
  it('rejects ads requiring Python', () => {
    expect(noUwantedSkills({ ...baseAd, requiredSkills: ['Python', 'React'] })).toBe(false)
  })

  it('rejects ads requiring Angular', () => {
    expect(noUwantedSkills({ ...baseAd, requiredSkills: ['Angular'] })).toBe(false)
  })

  it('accepts ads with React and no blocked skills', () => {
    expect(noUwantedSkills(baseAd)).toBe(true)
  })
})

describe('isSalaryAcceptable', () => {
  it('rejects salary below 25 000 net', () => {
    expect(
      isSalaryAcceptable({
        ...baseAd,
        monthlySalaryRangeAfterTaxes: { from: 20_000, to: 24_000 },
      }),
    ).toBe(false)
  })

  it('accepts salary above 25 000 net', () => {
    expect(isSalaryAcceptable(baseAd)).toBe(true)
  })

  it('rejects ads without salary range', () => {
    expect(isSalaryAcceptable({ ...baseAd, monthlySalaryRangeAfterTaxes: undefined })).toBe(false)
  })
})

describe('notManager', () => {
  it('rejects titles containing Manager', () => {
    expect(notManager({ ...baseAd, title: 'Engineering Manager' })).toBe(false)
  })

  it('accepts titles without Manager', () => {
    expect(notManager(baseAd)).toBe(true)
  })
})

describe('withReact', () => {
  it('requires React in skills', () => {
    expect(withReact({ ...baseAd, requiredSkills: ['Vue'] })).toBe(false)
    expect(withReact(baseAd)).toBe(true)
  })
})

describe('isHybridOrRemote', () => {
  it('accepts hybrid and remote', () => {
    expect(isHybridOrRemote({ ...baseAd, workplaceType: 'hybrid' })).toBe(true)
    expect(isHybridOrRemote({ ...baseAd, workplaceType: 'remote' })).toBe(true)
  })

  it('rejects office', () => {
    expect(isHybridOrRemote({ ...baseAd, workplaceType: 'office' })).toBe(false)
  })
})
