import { type ReactNode } from 'react'
import { useFeed } from '@repo/feed-client'
import { KnxReadingType, type KNXReadingPayload } from '@repo/types'
import { type ColorIndicationRange } from './ColorIndication'
import { Graph, type DataPoint, type GraphProps } from './Graph'
import { HoursBars, type HoursBarsProps, type Record as HistoryRecord } from './HoursBars'
import ValuePlaceholder from './ValuePlaceholder'
import { Reading, Unit } from './Reading'
import { Box } from '@mui/system'

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
    return <ValuePlaceholder label={label} />
  }

  const { reading, history } = payload
  const historyBars = history?.[bars?.historyKey ?? ''] as HistoryRecord[] | undefined
  const historyGraph = history?.[graph?.historyKey ?? 'value'] as DataPoint[] | undefined
  const display = formatValue
    ? formatValue(reading as KnxValue<string | number>)
    : Number(reading.value).toFixed(precision)

  return (
    <Reading
      title={label}
      graph={
        <>
          {bars !== undefined ? (
            <HoursBars
              highest={bars.highest}
              optimal={bars.optimal}
              lowest={bars.lowest}
              reverse={bars.reverse}
              color={bars.color}
              valueKey={bars.valueKey}
              data={historyBars}
            />
          ) : null}
          {graph !== undefined ? (
            <Graph scaleX={graph.scaleX} scaleY={graph.scaleY} valueKey={graph.valueKey} data={historyGraph} />
          ) : null}
        </>
      }
      extraInfo={
        <>
          {icon !== undefined ? (
            <>
              <Box sx={{ display: 'inline-block', verticalAlign: 'middle' }}>{icon}</Box>{' '}
            </>
          ) : null}
          {target !== undefined ? (
            <Box sx={{ display: 'inline-block', verticalAlign: 'text-top', fontSize: '10px' }}>
              {target(payload)}
              {unit && reading.unit !== undefined ? (
                <>
                  {' '}
                  <Unit>{reading.unit}</Unit>
                </>
              ) : null}
            </Box>
          ) : null}
        </>
      }
      colorIndicatorRange={range}
      value={Number(reading.value)}
      unit={unit ? reading.unit : undefined}
      displayValue={display}
    />
  )
}

export default KnxReading
export type { KnxValue }
