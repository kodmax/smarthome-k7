import { type Record } from './Graph'

const height = 100
const width = 300

export type GraphSeries = {
  points: string
  actives: string[]
  min: number
  max: number
  stroke: string
}

export function buildGraphSeries(
  data: Record[],
  scaleY: number,
  scaleX: number,
  now: number,
  valueKey = 'value',
  activeKey = 'active',
): GraphSeries {
  const dataPoints = data.map(record => ({
    datetime: record.datetime,
    active: Boolean(record[activeKey]),
    value: Number(record[valueKey]),
  }))

  const values = dataPoints.map(dp => dp.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const mid = (min + max) / 2
  const spread = max - min

  const records = dataPoints.map(({ datetime, value, active }) => ({
    age: (((now - new Date(datetime).getTime()) / 3600_000) * width) / scaleX / 24,
    active,
    value,
  }))

  const stepY = spread > scaleY ? spread / height : scaleY / height
  const points = records
    .filter(({ age }) => age <= width)
    .map(({ age, value }) => {
      const y = Number(height / 2 - (value - mid) / stepY).toFixed(4)
      const x = Number(width - age).toFixed(4)
      return `${x},${y}`
    })

  const actives = records
    .filter(record => record.age <= width && record.active)
    .map(({ age }) => Number(width - age).toFixed(4))

  return {
    points: points.join(' '),
    actives,
    min,
    max,
    stroke: spread > scaleY ? 'hsl(0deg 100% 50%)' : 'hsl(0deg 0% 20%)',
  }
}
