import { JobMarketPopularTechnology, MySkill } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { mergePopularTechnologiesWithMySkills } from './mergePopularTechnologiesWithMySkills'

const popular = (id: string, name: string): JobMarketPopularTechnology => ({
  id,
  name,
  offersCount: 10,
  sharePercent: 5,
  medianSalary: 20_000,
})

const mySkill = (id: string, name: string, level: MySkill['level'] = 'regular'): MySkill => ({
  id,
  name,
  level,
  comment: null,
})

describe('mergePopularTechnologiesWithMySkills', () => {
  it('returns popular technologies when my skills are empty', () => {
    expect(mergePopularTechnologiesWithMySkills([popular('react', 'React')], [])).toEqual([popular('react', 'React')])
  })

  it('appends my skills missing from popular technologies', () => {
    expect(
      mergePopularTechnologiesWithMySkills([popular('react', 'React')], [mySkill('java', 'Java', 'not-interested')]),
    ).toEqual([
      popular('react', 'React'),
      {
        id: 'java',
        name: 'Java',
        offersCount: 0,
        sharePercent: 0,
        medianSalary: null,
      },
    ])
  })

  it('does not duplicate skills already present in popular technologies', () => {
    expect(
      mergePopularTechnologiesWithMySkills([popular('react', 'React')], [mySkill('react', 'React', 'master')]),
    ).toEqual([popular('react', 'React')])
  })
})
