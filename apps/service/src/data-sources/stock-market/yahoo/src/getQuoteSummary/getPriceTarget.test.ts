import { describe, expect, it } from 'vitest'
import { getPriceTarget } from './getPriceTarget'
import { Rating } from './types'

const makeRating = (currentPriceTarget: number): Rating => ({
  action: 'main',
  currentPriceTarget,
  epochGradeDate: 0,
  firm: 'Test',
  fromGrade: 'Buy',
  priceTargetAction: 'Maintains',
  priorPriceTarget: 100,
  toGrade: 'Buy',
})

describe('getPriceTarget', () => {
  it('returns null when there are 5 or fewer valid ratings', () => {
    expect(getPriceTarget([1, 2, 3, 4, 5].map(makeRating))).toBeNull()
  })

  it('ignores ratings with zero price target', () => {
    const ratings = [...[1, 2, 3, 4, 5, 6].map(makeRating), makeRating(0)]
    expect(getPriceTarget(ratings)).not.toBeNull()
  })

  it('returns average of valid targets minus 1', () => {
    const ratings = [100, 200, 300, 400, 500, 600].map(makeRating)
    expect(getPriceTarget(ratings)).toBe(350 - 1)
  })
})
