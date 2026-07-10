import { type FC } from 'react'
import { ColorIndicator, type ColorIndicationRange } from '../ColorIndication'
import Copy from '../Copy'
import { IndicatorSlot, UnitSlot, ValueLayout, ValueSlot } from './styled'

type ReadingValueProps = {
  displayValue: string | number
  unit?: string
  colorIndicatorRange?: ColorIndicationRange
  value?: number
  copy?: string
}

export const ReadingValue: FC<ReadingValueProps> = ({ displayValue, unit, colorIndicatorRange, value, copy }) => (
  <>
    <ValueLayout>
      {copy !== undefined ? <Copy text={copy} /> : null}
      <ValueSlot>{displayValue}</ValueSlot>
      <UnitSlot>{unit ?? ''}</UnitSlot>
      <IndicatorSlot>
        {colorIndicatorRange !== undefined && value !== undefined ? (
          <ColorIndicator instant={value} range={colorIndicatorRange} />
        ) : null}
      </IndicatorSlot>
    </ValueLayout>
  </>
)
