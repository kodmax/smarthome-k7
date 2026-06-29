import { styled } from '@mui/material'
import { type FC } from 'react'
import { chooseColor } from './ColorIndication'
import { buildHoursBarHeights, toHoursBarDataPoints } from './hoursBarsData'

const grayColor = 'hsl(0deg 0% 50%)'

export interface Record {
  [key: string]: string | number
  hour: string | number
}

export type DataPoint = {
  hour: number
  value: number
}

const baseFontSize = 12

const Vector = styled('span')({
  display: 'inline-block',
  verticalAlign: 'bottom',

  height: Number(14 / baseFontSize).toFixed(3) + 'em',
  width: Number(48 / baseFontSize).toFixed(3) + 'em',
})

const Svg = styled('svg')({
  display: 'block',
  height: '100%',
  width: '100%',
})

const height = 100
const width = 300

export type HoursBarsProps = {
  data?: Record[]
  highest: number
  lowest?: number
  optimal?: number
  reverse?: boolean
  color?: boolean
  valueKey?: string
}
export const HoursBars: FC<HoursBarsProps> = ({
  data,
  highest,
  lowest = 0,
  optimal,
  reverse,
  color = false,
  valueKey = 'value',
}) => {
  if (data) {
    const dataPoints = toHoursBarDataPoints(data, valueKey)
    const bars = buildHoursBarHeights(dataPoints, highest, lowest, height)
    const valuesByHour: Array<number | undefined> = new Array(24).fill(undefined)

    for (const dp of dataPoints) {
      valuesByHour[dp.hour] = dp.value
    }

    const range = { lowest, optimal, highest, reverse }

    return (
      <Vector>
        <Svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          strokeWidth={1}
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
        >
          {bars.map((v, i) => {
            const value = valuesByHour[i]
            if (v === void 0 || value === void 0) {
              return null
            }

            return (
              <rect
                key={i}
                x={7 + i * 12}
                y={height - v}
                width='10'
                height={v}
                fill={color ? chooseColor(value, range) : grayColor}
              />
            )
          })}
        </Svg>
      </Vector>
    )
  } else {
    return null
  }
}
