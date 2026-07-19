import { type FC } from 'react'
import { HourWeatherForecast } from '@repo/types'
import { DayLabel } from './DayLabel'
import { HourWeatherIcon } from './HourWeatherIcon'
import { PrecipRow } from './PrecipRow'
import { SunRow } from './SunRow'
import { HourColumn, HourColumns, HourRoot } from './styled'
import { Temperature } from './Temperature'
import { WindRow } from './WindRow'

export const Hour: FC<{ fc: HourWeatherForecast; zoom: boolean; weekdayLabel: string }> = ({ fc, weekdayLabel }) => (
  <HourRoot>
    <DayLabel weekdayLabel={weekdayLabel} hour={fc.hour} />
    <HourColumns>
      <HourColumn>
        <HourWeatherIcon icon={fc.icon} />
        <Temperature temp={fc.temp} />
      </HourColumn>
      <HourColumn>
        <SunRow sunAltitude={Number(fc.sun.altitude)} uv={fc.uv} />
        <WindRow wind={fc.wind} />
        <PrecipRow precipType={fc.precipType} precip={fc.precip} />
      </HourColumn>
    </HourColumns>
  </HourRoot>
)
