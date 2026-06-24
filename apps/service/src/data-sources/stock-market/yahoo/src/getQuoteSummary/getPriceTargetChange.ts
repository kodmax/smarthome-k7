import { Rating } from './types'

export const getPriceTargetChange = (ratingHistory: Rating[], days: number): number => {
  const minTimestamp = new Date().getTime() / 1000 - days * 24 * 3_600
  const inRangeRatings = ratingHistory.filter(
    item => item.epochGradeDate >= minTimestamp && item.priceTargetAction !== 'Announces',
  )

  if (inRangeRatings.length === 0) {
    return 0
  }

  const s = inRangeRatings.reduce((a, c) => a + c.currentPriceTarget / c.priorPriceTarget, 0)
  return s / inRangeRatings.length - 1
}
