import { NightIcon, SunIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { Unit } from '@/card-components'
import WeatherIcon from '../WeatherIcon'
import {
  HourColumn,
  IconSlot,
  PRECIP_ICON_SIZE,
  PrecipRow,
  RowText,
  SUN_ICON_SIZE,
  SunRow,
  WEATHER_ICON_SIZE,
} from './styled'
import { HourWeatherForecast } from '@repo/types'

const formatHourDisplay = (hour: string): string => (hour.includes(':') ? hour : `${hour}:00`)

const sunAltitudeColorRange = { lowest: -6, optimal: 30, highest: 50 } as const
const civilTwilightAltitude = sunAltitudeColorRange.lowest

export const Hour: FC<{ fc: HourWeatherForecast; zoom: boolean; weekdayLabel: string }> = ({ fc, weekdayLabel }) => {
  const sunAltitude = Number(fc.sun.altitude)

  return (
    <HourColumn>
      <RowText>
        {weekdayLabel} {formatHourDisplay(fc.hour)}
      </RowText>
      {sunAltitude < civilTwilightAltitude ? (
        <SunRow>
          <NightIcon size={SUN_ICON_SIZE} strokeWidth={designTokens.icon.strokeWidth} />
        </SunRow>
      ) : (
        <SunRow>
          <SunIcon size={SUN_ICON_SIZE} strokeWidth={designTokens.icon.strokeWidth} />
          <span>{fc.uv}</span>
          <Unit>UVI</Unit>
        </SunRow>
      )}
      <IconSlot>
        <WeatherIcon icon={fc.icon} width={`${WEATHER_ICON_SIZE}px`} height={`${WEATHER_ICON_SIZE}px`} />
      </IconSlot>
      <RowText>{Number(fc.temp).toFixed(0)} °C</RowText>
      <PrecipRow>
        <WeatherIcon icon={fc.precipIcon} width={`${PRECIP_ICON_SIZE}px`} height={`${PRECIP_ICON_SIZE}px`} />
        <span> {fc.precip}</span>
      </PrecipRow>
    </HourColumn>
  )
}
