import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getLastRatings } from './getLastRatings'
import { Rating } from './types'

const makeRating = (epochGradeDate: number): Rating => ({
  action: 'main',
  currentPriceTarget: 100,
  epochGradeDate,
  firm: 'Test',
  fromGrade: 'Buy',
  priceTargetAction: 'Maintains',
  priorPriceTarget: 90,
  toGrade: 'Buy',
})

describe('getLastRatings', () => {
  const now = new Date('2025-06-28T12:00:00Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns ratings within the given day window', () => {
    const nowSec = now.getTime() / 1000
    const ratings = [
      makeRating(nowSec - 1 * 24 * 3600),
      makeRating(nowSec - 10 * 24 * 3600),
      makeRating(nowSec - 31 * 24 * 3600),
    ]

    expect(getLastRatings(ratings, 30)).toEqual([ratings[0], ratings[1]])
  })

  it('returns empty array when all ratings are too old', () => {
    const nowSec = now.getTime() / 1000
    const ratings = [makeRating(nowSec - 40 * 24 * 3600)]

    expect(getLastRatings(ratings, 30)).toEqual([])
  })
})
