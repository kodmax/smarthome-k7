import { Rating } from './types'

export const getLastRatings = (ratingHistory: Rating[], days: number): Rating[] => {
  const minTimestamp = new Date().getTime() / 1000 - days * 24 * 3_600
  return ratingHistory.filter(item => item.epochGradeDate >= minTimestamp)
}
