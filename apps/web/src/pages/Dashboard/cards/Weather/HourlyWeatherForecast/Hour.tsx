import { NightIcon, SunIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { Unit } from '@/card-components'
import WeatherIcon from '../WeatherIcon'
import { precipTypeIcon } from '../precipTypeIcons'
import {
  HourColumn,
  IconSlot,
  PRECIP_ICON_SIZE,
  PrecipRow,
  RowText,
  SUN_ICON_SIZE,
  SunIconSlot,
  SunRow,
  SunUvLabel,
  WEATHER_ICON_SIZE,
} from './styled'
import { HourWeatherForecast } from '@repo/types'

const formatHourDisplay = (hour: string): string => (hour.includes(':') ? hour : `${hour}:00`)

const sunAltitudeColorRange = { lowest: -6, optimal: 30, highest: 50 } as const
const civilTwilightAltitude = sunAltitudeColorRange.lowest

export const Hour: FC<{ fc: HourWeatherForecast; zoom: boolean; weekdayLabel: string }> = ({ fc, weekdayLabel }) => {
  const sunAltitude = Number(fc.sun.altitude)
  const PrecipIcon = precipTypeIcon(fc.precipType)

  return (
    <HourColumn>
      <RowText>
        {weekdayLabel} {formatHourDisplay(fc.hour)}
      </RowText>
      {sunAltitude < civilTwilightAltitude ? (
        <SunRow>
          <SunIconSlot>
            <NightIcon size={SUN_ICON_SIZE} strokeWidth={designTokens.icon.strokeWidth} />
          </SunIconSlot>
        </SunRow>
      ) : (
        <SunRow>
          <SunIconSlot>
            <SunIcon size={SUN_ICON_SIZE} strokeWidth={designTokens.icon.strokeWidth} />
          </SunIconSlot>
          <SunUvLabel>
            <span>{fc.uv}</span>
            <Unit>UVI</Unit>
          </SunUvLabel>
        </SunRow>
      )}
      <IconSlot>
        <WeatherIcon icon={fc.icon} width={`${WEATHER_ICON_SIZE}px`} height={`${WEATHER_ICON_SIZE}px`} />
      </IconSlot>
      <RowText>{Number(fc.temp).toFixed(0)} °C</RowText>
      <PrecipRow>
        <PrecipIcon size={PRECIP_ICON_SIZE} strokeWidth={designTokens.icon.strokeWidth} />
        <span>{fc.precip}</span>
      </PrecipRow>
    </HourColumn>
  )
}
