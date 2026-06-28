import { type DataPoint, type Record } from './HoursBars'

export function toHoursBarDataPoints(data: Record[], valueKey: string): DataPoint[] {
  return data.map(record => ({
    hour: Number(typeof record.hour === 'string' ? record.hour.substring(0, 2) : record.hour),
    value: Number(record[valueKey]),
  }))
}

export function buildHoursBarHeights(
  dataPoints: DataPoint[],
  positiveMax: number,
  negativeMax: number,
  barHeight = 100,
): Array<number | undefined> {
  const bars: Array<number | undefined> = new Array(24).fill(undefined)

  for (const dp of dataPoints) {
    const v = (dp.value >= 0 ? dp.value / positiveMax : dp.value / negativeMax) * barHeight
    bars[dp.hour] = v
  }

  return bars
}
