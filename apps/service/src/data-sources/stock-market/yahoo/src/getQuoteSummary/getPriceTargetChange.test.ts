import { describe, expect, it } from 'vitest'
import { getPriceTargetChange } from './getPriceTargetChange'
import { Rating } from './types'

const makeRating = (currentPriceTarget: number, priorPriceTarget: number): Rating => ({
  action: 'main',
  currentPriceTarget,
  epochGradeDate: 0,
  firm: 'Test',
  fromGrade: 'Buy',
  priceTargetAction: 'Maintains',
  priorPriceTarget,
  toGrade: 'Buy',
})

describe('getPriceTargetChange', () => {
  it('returns null when there are 5 or fewer valid ratings', () => {
    const ratings = [1, 2, 3, 4, 5].map(n => makeRating(n * 10, 10))
    expect(getPriceTargetChange(ratings)).toBeNull()
  })

  it('ignores ratings with zero current or prior target', () => {
    const ratings = [...[1, 2, 3, 4, 5, 6].map(n => makeRating(110, 100)), makeRating(0, 100), makeRating(110, 0)]
    expect(getPriceTargetChange(ratings)).not.toBeNull()
  })

  it('returns average ratio minus 1', () => {
    const ratings = [110, 120, 130, 140, 150, 160].map((current, i) => makeRating(current, 100))
    const avgRatio = ratings.reduce((sum, r) => sum + r.currentPriceTarget / r.priorPriceTarget, 0) / ratings.length
    expect(getPriceTargetChange(ratings)).toBe(avgRatio - 1)
  })
})
