import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { CoolingIcon, ThermometerSunIcon, UVIcon, WeatherIcon as WeatherCardIcon, WindIcon } from '@repo/assets'
import { ApolloDataTable, HoursBars, Reading, TablePlaceholder } from '@/card-components'
import { BaseCard, useZoom } from '@repo/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { ArrowUp } from 'lucide-react'
import { getPosition, getMoonPosition } from 'suncalc'
import { useFeed } from '@repo/feed-client'
import { WeatherFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { CardHeadingHints, CardHintIcon, formatHintLine } from '@/app/hints'
import { beaufortLevelLabel, beaufortScaleFromMetersPerSecond } from './beaufort'
import { optimalHumidityRange } from './optimalHumidityRange'
import { sunTimes } from './sunTimes'
import {
  shouldShowFrostHint,
  shouldShowHighUvHint,
  shouldShowHotOutdoorHint,
  shouldShowStrongWindHint,
} from './weatherHints'

export const Weather: FC<Record<string, never>> = () => {
  const zoom = useZoom('current-weather')
  const feed = useFeed<WeatherFeed>('weather')
  const { t } = useTranslations()
  const labels = t.dashboard.weather
  const hintExplanations = t.dashboard.hintExplanations

  if (feed === undefined) {
    return (
      <BaseCard cardId='current-weather' title={labels.title} icon={WeatherCardIcon}>
        <TablePlaceholder rows={4} graph={true} value={true} />
      </BaseCard>
    )
  }
  const moonAlt = (getMoonPosition(new Date(), 52.2287755, 20.9756375).altitude / Math.PI) * 180
  const sunAlt = (getPosition(new Date(), 52.2287755, 20.9756375).altitude / Math.PI) * 180
  const bs = beaufortScaleFromMetersPerSecond(feed.instant.wind.speed)
  const hum = feed.instant.humidity
  const sun = sunTimes(feed)

  const windMaxSpeed = feed.instant.wind.maxSpeed
  const windSpeed = feed.instant.wind.speed

  const showStrongWind = shouldShowStrongWindHint(feed.instant.wind.speed)
  const showHotOutdoor = shouldShowHotOutdoorHint(feed.instant.temp)
  const showHighUv = shouldShowHighUvHint(feed.instant.uv)
  const showFrost = shouldShowFrostHint(feed.instant.temp)

  return (
    <BaseCard
      cardId='current-weather'
      title={labels.title}
      icon={WeatherCardIcon}
      headingInfo={
        showStrongWind || showHotOutdoor || showHighUv || showFrost ? (
          <CardHeadingHints>
            {showStrongWind ? (
              <CardHintIcon
                Icon={WindIcon}
                variant='info'
                title={labels.strongWind}
                description={formatHintLine(hintExplanations.strongWind.line1, windSpeed, 0)}
              />
            ) : null}
            {showHotOutdoor ? (
              <CardHintIcon
                Icon={ThermometerSunIcon}
                variant='warning'
                title={labels.hotOutdoor}
                description={formatHintLine(hintExplanations.hotOutdoor.line1, Number(feed.instant.temp), 0)}
              />
            ) : null}
            {showHighUv ? (
              <CardHintIcon
                Icon={UVIcon}
                variant='warning'
                title={labels.highUv}
                description={formatHintLine(hintExplanations.highUv.line1, feed.instant.uv, 1)}
              />
            ) : null}
            {showFrost ? (
              <CardHintIcon
                Icon={CoolingIcon}
                variant='info'
                title={labels.frost}
                description={formatHintLine(hintExplanations.frost.line1, Number(feed.instant.temp), 0)}
              />
            ) : null}
          </CardHeadingHints>
        ) : undefined
      }
    >
      <ApolloDataTable>
        <TableBody>
          <Reading
            title={labels.temperature}
            graph={<HoursBars data={feed.outdoorTemp} highest={30} lowest={15} optimal={24} color />}
            displayValue={Number(feed.instant.temp).toFixed(0)}
            unit='°C'
            colorIndicatorRange={{ optimal: 21, highest: 30, lowest: 15 }}
            value={feed.instant.temp}
          />
          <Reading
            title={labels.uvIndex}
            displayValue={String(feed.instant.uv)}
            colorIndicatorRange={{ optimal: 4, highest: 8, lowest: 0 }}
            value={feed.instant.uv}
          />
          <Reading
            title={labels.humidity}
            displayValue={hum.toFixed(0)}
            unit='%'
            colorIndicatorRange={optimalHumidityRange}
            value={hum}
          />
          <Reading
            title={labels.windSpeed}
            graph={
              <span style={{ fontSize: '0.5em' }}>
                {zoom ? `${bs} - ${beaufortLevelLabel(bs, labels.beaufortScale)}` : `${bs} B`}
              </span>
            }
            extraInfo={
              zoom ? (
                <ArrowUp
                  size={designTokens.icon.sizeXs - 4}
                  strokeWidth={designTokens.icon.strokeWidth}
                  style={{
                    transform: `rotate(${feed.instant.wind.angle}deg)`,
                    marginRight: `${designTokens.space[1]}px`,
                    verticalAlign: 'middle',
                  }}
                />
              ) : undefined
            }
            displayValue={windSpeed.toFixed(0)}
            unit='m/s'
            colorIndicatorRange={{ lowest: 0, highest: 7, optimal: 1 }}
            value={bs}
          />
          {!zoom ? null : <Reading title={labels.windGusts} displayValue={windMaxSpeed.toFixed(0)} unit='m/s' />}
          {!zoom ? null : sun.timeOfDay === 'day' ? (
            <Reading
              title={labels.sunAltitude}
              displayValue={Number(sunAlt).toFixed(0)}
              unit='°'
              colorIndicatorRange={{ lowest: -6, optimal: 30, highest: 50 }}
              value={sunAlt}
            />
          ) : (
            <Reading title={labels.moonAltitude} displayValue={Number(moonAlt).toFixed(0)} unit='°' />
          )}
        </TableBody>
      </ApolloDataTable>
    </BaseCard>
  )
}
