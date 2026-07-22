/**
 * Returns the value at the p-th percentile (nearest-rank), or null when values is empty.
 *
 * Use placeholderCount when some items were excluded from values but should still
 * count as the lowest rank — e.g. ads without salary that sit below every mapped value.
 * The index is computed as if placeholderCount zero-valued entries were prepended.
 */
export const percentile = (values: number[], p: number, placeholderCount = 0): number | null => {
  if (values.length === 0) {
    return null
  }

  const totalCount = values.length + placeholderCount
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil((p / 100) * totalCount) - 1 - placeholderCount

  if (index < 0) {
    return 0
  }

  return sorted[index]
}

/**
 * Returns the p-th percentile threshold for a collection of items.
 *
 * mapValue extracts a numeric score per item. undefined means "lowest rank" —
 * those items are not included in values, but they increase placeholderCount
 * passed to percentile (same effect as padding the bottom of the ranking).
 */
export const percentileOf = <T>(items: T[], p: number, mapValue: (item: T) => number | undefined): number | null => {
  const values = items.map(mapValue).filter((value): value is number => value !== undefined)

  return percentile(values, p, items.length - values.length)
}

/**
 * Returns items whose mapped value is at or above the p-th percentile threshold.
 *
 * Items mapped to undefined never appear in the result (they represent the bottom
 * of the ranking), but they still lower the threshold by increasing placeholderCount.
 */
export const filterByPercentileOf = <T>(items: T[], p: number, mapValue: (item: T) => number | undefined): T[] => {
  const threshold = percentileOf(items, p, mapValue)
  if (threshold === null) {
    return []
  }

  return items.filter(item => {
    const value = mapValue(item)
    return value !== undefined && value >= threshold
  })
}
