import { JobMarketInsightCountChange, JobMarketInsightPercentagePointChange } from '@repo/types'
import { formatNumber } from '@/helpers/formatNumber'

const formatSignedNumber = (value: number, fractionDigits = 0): string => {
  const formatted = formatNumber(Math.abs(value), { fractionDigits })
  if (value > 0) {
    return `+${formatted}`
  }

  if (value < 0) {
    return `-${formatted}`
  }

  return formatted
}

export const formatCountChange = (change: JobMarketInsightCountChange): string => {
  const absolute = formatSignedNumber(change.absolute)

  if (change.relativePercent === null) {
    return absolute
  }

  return `${absolute} (${formatSignedNumber(change.relativePercent, 1)}%)`
}

export const formatMedianSalaryChange = (change: JobMarketInsightCountChange): string => {
  const absolute = `${formatSignedNumber(change.absolute)} zł`

  if (change.relativePercent === null) {
    return absolute
  }

  return `${absolute} (${formatSignedNumber(change.relativePercent, 1)}%)`
}

export const formatPercentagePointChange = (change: JobMarketInsightPercentagePointChange): string =>
  `${formatSignedNumber(change.absolute)} pp`

export const getChangeTone = (value: number): 'positive' | 'negative' | 'neutral' => {
  if (value > 0) {
    return 'positive'
  }

  if (value < 0) {
    return 'negative'
  }

  return 'neutral'
}
