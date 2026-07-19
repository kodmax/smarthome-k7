import { type FC } from 'react'
import { DayLabelWrapper } from './styled'

const formatHourDisplay = (hour: string): string => (hour.includes(':') ? hour : `${hour}:00`)

export const DayLabel: FC<{ weekdayLabel: string; hour: string }> = ({ weekdayLabel, hour }) => (
  <DayLabelWrapper>
    {weekdayLabel}, {formatHourDisplay(hour)}
  </DayLabelWrapper>
)
