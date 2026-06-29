import { type ReactNode } from 'react'
import { useFeed } from '@repo/feed-client'
import { ColorIndicator, type ColorIndicationRange } from './ColorIndication'
import { Graph, type DataPoint, type GraphProps } from './Graph'
import { HoursBars, type HoursBarsProps, type Record } from './HoursBars'
import { KnxReadingType } from '@repo/types'

type KnxValue<T> = KnxReadingType<T> & {
  [key: string]: unknown
}

type Props<P> = {
  precision?: number
  id: string
  label: string
  unit?: boolean
  range?: ColorIndicationRange
  bars?: Omit<HoursBarsProps, 'data'> & { historyKey: string }
  graph?: Omit<GraphProps, 'data'> & { historyKey: string }
  icon?: ReactNode
  target?: (payload: P) => string
}

const KnxReading = <T extends KnxValue<string | number> = KnxValue<string | number>>({
  icon,
  id,
  label,
  unit = true,
  range,
  bars,
  graph,
  precision = 0,
  target,
}: Props<T>) => {
  const reading = useFeed<T>(id)

  if (reading === undefined) {
    return (
      <tr>
        <td>{label}</td>
        <td></td>
        <td></td>
        <td style={{ color: 'silver' }}>--</td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{label}</td>
      <td>
        {!bars ? null : (
          <HoursBars
            highest={bars.highest}
            optimal={bars.optimal}
            lowest={bars.lowest}
            gradient={bars.gradient}
            valueKey={bars.valueKey}
            data={reading[bars.historyKey] as Record[]}
          />
        )}
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
        {unit ? (reading.unit as string) : null}
      </td>
    </tr>
  )
}

export default KnxReading
export type { KnxValue }
