import { styled } from '@mui/material'
import { type FC } from 'react'
import { renderToString } from 'react-dom/server'

export interface Record {
  datetime: string
  [key: string]: string | number | boolean
}

export type DataPoint = {
  datetime: string
  value: number
  active: boolean
}

const baseFontSize = 12

const Vector = styled('span')({
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: '0.75em',
  backgroundSize: 'contain',
  display: 'inline-block',
  verticalAlign: 'top',
  position: 'relative',
  paddingLeft: '0.75em',

  height: Number(12 / baseFontSize).toFixed(3) + 'em',
  width: Number(48 / baseFontSize).toFixed(3) + 'em',
})

const Min = styled('span')({
  position: 'absolute',
  fontSize: '0.25em',
  lineHeight: 1,
  left: 0,
  bottom: '1em',
})

const Max = styled('span')({
  position: 'absolute',
  fontSize: '0.25em',
  lineHeight: 1,
  left: 0,
  top: '1em',
})

const height = 100
const width = 300

export type GraphProps = { data?: Record[]; scaleY: number; scaleX: number; valueKey?: string; activeKey?: string }
export const Graph: FC<GraphProps> = ({ data, scaleY, scaleX, valueKey = 'value', activeKey = 'active' }) => {
  if (data) {
    const dataPoints: DataPoint[] = data.map(record => {
      return {
        datetime: record.datetime,
        active: Boolean(record[activeKey]),
        value: Number(record[valueKey]),
      }
    })

    const values: number[] = dataPoints.map(dp => dp.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const mid = (min + max) / 2
    const spread = max - min

    const now = new Date().getTime()
    const records = dataPoints.map(({ datetime, value, active }: DataPoint) => {
      return {
        age: (((now - new Date(datetime).getTime()) / 3600_000) * width) / scaleX / 24,
        active,
        value,
      }
    })

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
      .map(({ age }) => {
        return Number(width - age).toFixed(4)
      })

    const svg = renderToString(
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        strokeWidth={5}
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
      >
        <>
          <polyline
            stroke={spread > scaleY ? 'hsl(0deg 100% 50%)' : 'hsl(0deg 0% 20%)'}
            fill='none'
            points={points.join(' ')}
          />
          {actives.map(x => (
            <circle key={x} cx={x} cy='98' r='0.2' strokeWidth='0' fill='red' />
          ))}
        </>
      </svg>,
    )

    return (
      <Vector style={{ backgroundImage: `url("data:image/svg+xml;base64,${btoa(svg)}")` }}>
        <Max>{max.toFixed(2).replace('.00', '')}</Max>
        <Min>{min.toFixed(2).replace('.00', '')}</Min>
      </Vector>
    )
  } else {
    return null
  }
}
