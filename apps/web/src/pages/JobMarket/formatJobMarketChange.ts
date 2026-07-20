import { formatNumber } from '@/helpers/formatNumber'

export type JobMarketMetricVariant = 'count' | 'currency' | 'percent'

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

export const getAbsoluteChange = (value: number, previous: number): number => value - previous

const computeRelativePercent = (value: number, previous: number): number | null =>
  previous === 0 ? null : ((value - previous) / previous) * 100

const formatCountChange = (value: number, previous: number): string => {
  const absolute = getAbsoluteChange(value, previous)
  const relativePercent = computeRelativePercent(value, previous)

  if (relativePercent === null) {
    return formatSignedNumber(absolute)
  }

  return `${formatSignedNumber(absolute)} (${formatSignedNumber(relativePercent, 1)}%)`
}

const formatCurrencyChange = (value: number, previous: number): string => {
  const absolute = getAbsoluteChange(value, previous)
  const relativePercent = computeRelativePercent(value, previous)
  const formattedAbsolute = `${formatSignedNumber(absolute)} zł`

  if (relativePercent === null) {
    return formattedAbsolute
  }

  return `${formattedAbsolute} (${formatSignedNumber(relativePercent, 1)}%)`
}

const formatPercentagePointChange = (value: number, previous: number): string =>
  `${formatSignedNumber(getAbsoluteChange(value, previous))} pp`

export const formatMetricValue = (value: number, variant: JobMarketMetricVariant): string => {
  switch (variant) {
    case 'count':
      return formatNumber(value, { fractionDigits: 0 })
    case 'currency':
      return `${formatNumber(value, { fractionDigits: 0 })} zł`
    case 'percent':
      return `${value}%`
  }
}

export const formatMetricChange = (value: number, previous: number, variant: JobMarketMetricVariant): string => {
  switch (variant) {
    case 'count':
      return formatCountChange(value, previous)
    case 'currency':
      return formatCurrencyChange(value, previous)
    case 'percent':
      return formatPercentagePointChange(value, previous)
  }
}

export const getChangeTone = (value: number): 'positive' | 'negative' | 'neutral' => {
  if (value > 0) {
    return 'positive'
  }

  if (value < 0) {
    return 'negative'
  }

  return 'neutral'
}
