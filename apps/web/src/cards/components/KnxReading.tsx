import { type ReactNode } from 'react'
import { useFeed } from '@repo/feed-client'
import { KnxReadingType, type KNXReadingPayload } from '@repo/types'
import { ColorIndicator, type ColorIndicationRange } from './ColorIndication'
import { Graph, type DataPoint, type GraphProps } from './Graph'
import { HoursBars, type HoursBarsProps, type Record as HistoryRecord } from './HoursBars'

type KnxValue<T> = KnxReadingType<T> & {
  [key: string]: unknown
}

type Props = {
  precision?: number
  feed: string | KNXReadingPayload
  label: string
  unit?: boolean
  range?: ColorIndicationRange
  bars?: Omit<HoursBarsProps, 'data'> & { historyKey: string }
  graph?: Omit<GraphProps, 'data'> & { historyKey: string }
  icon?: ReactNode
  target?: (payload: KNXReadingPayload & Record<string, unknown>) => string
  formatValue?: (reading: KnxValue<string | number>) => string
}

const KnxReading = ({
  icon,
  feed,
  label,
  unit = true,
  range,
  bars,
  graph,
  precision = 0,
  target,
  formatValue,
}: Props) => {
  const topic = typeof feed === 'string' ? feed : undefined
  const subscribed = useFeed<KNXReadingPayload & Record<string, unknown>>(topic)
  const payload = typeof feed === 'string' ? subscribed : feed

  if (payload === undefined) {
    return (
      <tr>
        <td>{label}</td>
        <td></td>
        <td></td>
        <td style={{ color: 'silver' }}>--</td>
      </tr>
    )
  }

  const { reading, history } = payload
  const historyBars = history?.[bars?.historyKey ?? ''] as HistoryRecord[] | undefined
  const historyGraph = history?.[graph?.historyKey ?? 'value'] as DataPoint[] | undefined
  const display = formatValue
    ? formatValue(reading as KnxValue<string | number>)
    : `${Number(reading.value).toFixed(precision)}${unit ? reading.unit : ''}`

  return (
    <tr>
      <td>{label}</td>
      <td>
        {!bars ? null : (
          <HoursBars
            highest={bars.highest}
            optimal={bars.optimal}
            lowest={bars.lowest}
            reverse={bars.reverse}
            color={bars.color}
            valueKey={bars.valueKey}
            data={historyBars}
          />
        )}
        {!graph ? null : (
          <Graph scaleX={graph.scaleX} scaleY={graph.scaleY} valueKey={graph.valueKey} data={historyGraph} />
        )}
      </td>
      <td>
        <span>{icon}</span>
        <span style={{ fontSize: '0.25em', verticalAlign: 'super' }}>
          {target ? `${target(payload)} ${unit ? reading.unit : ''}` : null}
        </span>
      </td>
      <td>
        {range ? <ColorIndicator instant={reading.value as number} range={range} /> : null}
        {display}
      </td>
    </tr>
  )
}

export default KnxReading
export type { KnxValue }
