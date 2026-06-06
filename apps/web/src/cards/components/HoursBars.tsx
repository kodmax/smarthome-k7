import { styled } from '@mui/material'
import { type FC } from 'react'
import { renderToString } from 'react-dom/server'

export interface Record {
  [key: string]: any
  hour: string | number
}

export type DataPoint = {
  hour: number
  value: number
}

const baseFontSize = 12

const Vector = styled('span')({
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  display: 'inline-block',
  verticalAlign: 'top',

  height: Number(16 / baseFontSize).toFixed(3) + 'em',
  width: Number(48 / baseFontSize).toFixed(3) + 'em',
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
        value: record[valueKey],
      }
    })

    const bars = new Array(24).fill(void 0)
    for (const dp of dataPoints) {
      const v = Number((dp.value >= 0 ? dp.value / positiveMax : dp.value / negativeMax) * height).toFixed(3)
      bars[dp.hour] = v
    }

    const svg = renderToString(
      <svg
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
      </svg>,
    )

    return <Vector style={{ backgroundImage: `url("data:image/svg+xml;base64,${btoa(svg)}")` }}></Vector>
  } else {
    return null
  }
}
