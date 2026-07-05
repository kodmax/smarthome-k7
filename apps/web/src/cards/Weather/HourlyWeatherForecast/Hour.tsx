import { type FC } from 'react'
import WeatherIcon from '../WeatherIcon'
import { HourColumn, IconSlot, PRECIP_ICON_SIZE, PrecipRow, RowText, SunText, WEATHER_ICON_SIZE } from './styled'
import { HourWeatherForecast } from '@repo/types'

export const Hour: FC<{ fc: HourWeatherForecast; zoom: boolean }> = ({ fc, zoom }) => {
  return (
    <HourColumn>
      <RowText>{fc.hour}:00</RowText>
      <IconSlot>
        <WeatherIcon icon={fc.icon} width={`${WEATHER_ICON_SIZE}px`} height={`${WEATHER_ICON_SIZE}px`} />
      </IconSlot>
      <RowText>{Number(fc.temp).toFixed(0)} °C</RowText>
      <PrecipRow>
        <WeatherIcon icon={fc.precipIcon} width={`${PRECIP_ICON_SIZE}px`} height={`${PRECIP_ICON_SIZE}px`} />
        <span> {fc.precip}</span>
      </PrecipRow>
      {zoom ? (
        <>
          <SunText>{Number(fc.sun.altitude).toFixed(0)}°</SunText>
        </>
      ) : null}
    </HourColumn>
  )
}
