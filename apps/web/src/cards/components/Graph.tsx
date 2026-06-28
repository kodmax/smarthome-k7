import { styled } from '@mui/material'
import { type FC } from 'react'
import { buildGraphSeries } from './graphSeries'

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
  display: 'inline-block',
  verticalAlign: 'top',
  position: 'relative',
  paddingLeft: '0.75em',

  height: Number(12 / baseFontSize).toFixed(3) + 'em',
  width: Number(48 / baseFontSize).toFixed(3) + 'em',
})

const Svg = styled('svg')({
  display: 'block',
  height: '100%',
  width: '100%',
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
    const { points, actives, min, max, stroke } = buildGraphSeries(
      data,
      scaleY,
      scaleX,
      new Date().getTime(),
      valueKey,
      activeKey,
    )

    return (
      <Vector>
        <Svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          strokeWidth={5}
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
        >
          <polyline stroke={stroke} fill='none' points={points} />
          {actives.map(x => (
            <circle key={x} cx={x} cy='98' r='0.2' strokeWidth='0' fill='red' />
          ))}
        </Svg>
        <Max>{max.toFixed(2).replace('.00', '')}</Max>
        <Min>{min.toFixed(2).replace('.00', '')}</Min>
      </Vector>
    )
  } else {
    return null
  }
}
