import { type DataPoint, type Record } from './HoursBars'

export function toHoursBarDataPoints(data: Record[], valueKey: string): DataPoint[] {
  return data.map(record => ({
    hour: Number(typeof record.hour === 'string' ? record.hour.substring(0, 2) : record.hour),
    value: Number(record[valueKey]),
  }))
}

export function buildHoursBarHeights(
  dataPoints: DataPoint[],
  highest: number,
  lowest = 0,
  barHeight = 100,
): Array<number | undefined> {
  const bars: Array<number | undefined> = new Array(24).fill(undefined)
  const range = highest - lowest

  for (const dp of dataPoints) {
    const scaled = range === 0 ? 0 : ((dp.value - lowest) / range) * barHeight
    bars[dp.hour] = Math.max(0, Math.min(barHeight, scaled))
  }

  return bars
}
