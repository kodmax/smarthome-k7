import { type FC, type ReactNode, useEffect } from 'react'
import { useUpdate } from '@repo/feed-client'
import { ColorIndicator, type ColorIndicationRange } from './ColorIndication'
import { Graph, type DataPoint, type GraphProps } from './Graph'
import { HoursBars, type Record } from './HoursBars'

type KnxValue = {
  value: string | number
  text: string
  [key: string]: any
}

type Props = {
  precision?: number
  id: string
  label: string
  unit?: boolean
  range?: ColorIndicationRange
  onUpdate: (ts: number) => void
  bars?: string
  graph?: Omit<GraphProps, 'data'> & { historyKey: string }
  icon?: ReactNode
  target?: (reading: KnxValue) => string
}
const KnxReading: FC<Props> = ({
  icon,
  id,
  label,
  unit = true,
  range,
  onUpdate,
  bars,
  graph,
  precision = 0,
  target,
}) => {
  const [reading, updatedAt] = useUpdate<KnxValue>(id)

  useEffect(() => {
    onUpdate(new Date().getTime())
  }, [updatedAt])

  if (reading) {
    return (
      <tr>
        <td>{label}</td>
        <td>
          {!bars ? null : <HoursBars positiveMax={range?.higest || 0} data={reading[bars] as Record[]} />}
          {!graph ? null : (
            <Graph
              scaleX={graph.scaleX}
              scaleY={graph.scaleY}
              valueKey={graph.valueKey}
              data={reading[graph.historyKey ?? 'value'] as DataPoint[]}
            />
          )}
        </td>
        <td>
          <span>{icon}</span>
          <span style={{ fontSize: '0.25em', verticalAlign: 'super' }}>
            {target ? `${target(reading)} ${unit ? reading.unit : ''}` : null}
          </span>
        </td>
        <td>
          <ColorIndicator instant={reading.value as number} range={range || {}} />
          {Number(reading.value).toFixed(precision)}
          {unit ? reading.unit : null}
        </td>
      </tr>
    )
  } else {
    return (
      <tr>
        <td>{label}</td>
        <td></td>
        <td></td>
        <td style={{ color: 'silver' }}>--</td>
      </tr>
    )
  }
}

export default KnxReading
export type { KnxValue }
