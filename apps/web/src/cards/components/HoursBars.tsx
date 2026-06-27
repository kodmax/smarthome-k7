import { styled } from '@mui/material'
import { type FC } from 'react'

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
  verticalAlign: 'top',

  height: Number(16 / baseFontSize).toFixed(3) + 'em',
  width: Number(48 / baseFontSize).toFixed(3) + 'em',
})

const Svg = styled('svg')({
  display: 'block',
  height: '100%',
  width: '100%',
})

const height = 100
const width = 300

export const HoursBars: FC<{ data?: Record[]; positiveMax: number; negativeMax?: number; valueKey?: string }> = ({
  data,
  positiveMax,
  negativeMax = positiveMax,
  valueKey = 'value',
}) => {
  if (data) {
    const dataPoints: DataPoint[] = data.map(record => {
      return {
        hour: Number(typeof record.hour === 'string' ? record.hour.substring(0, 2) : record.hour),
        value: Number(record[valueKey]),
      }
    })

    const bars: Array<number | undefined> = new Array(24).fill(void 0)
    for (const dp of dataPoints) {
      const v = (dp.value >= 0 ? dp.value / positiveMax : dp.value / negativeMax) * height
      bars[dp.hour] = v
    }

    return (
      <Vector>
        <Svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill='hsl(0deg 0% 50%)'
          strokeWidth={1}
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
        >
          {bars.map((v, i) =>
            v === void 0 ? null : <rect key={i} x={7 + i * 12} y={height - v} width='10' height={v} />,
          )}
        </Svg>
      </Vector>
    )
  } else {
    return null
  }
}
