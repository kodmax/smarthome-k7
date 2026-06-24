import { Rating } from './types'

const MIN_LENGTH = 5

export const getPriceTargetChange = (ratingHistory: Rating[]): number | null => {
  const validRatings = ratingHistory.filter(item => item.currentPriceTarget > 0 && item.priorPriceTarget > 0)

  if (validRatings.length <= MIN_LENGTH) {
    return null
  }

  const s = validRatings.reduce((a, c) => a + c.currentPriceTarget / c.priorPriceTarget, 0)
  return s / validRatings.length - 1
}
