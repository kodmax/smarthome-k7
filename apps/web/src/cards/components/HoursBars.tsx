import { styled } from '@mui/material'
import { type FC, useId } from 'react'
import { buildHoursBarHeights, toHoursBarDataPoints } from './hoursBarsData'

const grayColor = 'hsl(0deg 0% 50%)'

const highestColor = 'hsl(4deg 52% 62%)'
const optimalColor = 'hsl(132deg 36% 54%)'
const lowestColor = 'hsl(215deg 48% 63%)'

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
  gradient?: boolean
  valueKey?: string
}
export const HoursBars: FC<HoursBarsProps> = ({
  data,
  highest,
  lowest = 0,
  optimal,
  gradient = false,
  valueKey = 'value',
}) => {
  const gradientId = useId()
  const range = highest - lowest
  const optimalOffset =
    gradient && optimal !== undefined && range !== 0
      ? Math.min(100, Math.max(0, ((highest - optimal) / range) * 100))
      : undefined
  const barFill = gradient ? `url(#${gradientId})` : grayColor

  if (data) {
    const dataPoints = toHoursBarDataPoints(data, valueKey)
    const bars = buildHoursBarHeights(dataPoints, highest, lowest, height)

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
          {gradient ? (
            <defs>
              <linearGradient id={gradientId} gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='0' y2={height}>
                <stop offset='0%' stopColor={highestColor} />
                {optimalOffset !== undefined ? <stop offset={`${optimalOffset}%`} stopColor={optimalColor} /> : null}
                <stop offset='100%' stopColor={lowestColor} />
              </linearGradient>
            </defs>
          ) : null}
          {bars.map((v, i) =>
            v === void 0 ? null : <rect key={i} x={7 + i * 12} y={height - v} width='10' height={v} fill={barFill} />,
          )}
        </Svg>
      </Vector>
    )
  } else {
    return null
  }
}
