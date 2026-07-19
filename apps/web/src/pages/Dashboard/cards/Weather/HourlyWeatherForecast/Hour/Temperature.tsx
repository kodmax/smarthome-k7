import { type FC } from 'react'
import { Unit } from '@/card-components'
import { TemperatureValue } from './styled'

export const Temperature: FC<{ temp: string }> = ({ temp }) => (
  <TemperatureValue>
    <span>{Number(temp).toFixed(0)}</span> <Unit>°C</Unit>
  </TemperatureValue>
)
