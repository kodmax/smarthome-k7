import { WindIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { HourWeatherForecast } from '@repo/types'
import { ArrowUp } from 'lucide-react'
import { type FC } from 'react'
import { Unit } from '@/card-components'
import { shouldShowStrongWindHint } from '../../weatherHints'
import { windDirectionAngle } from '../../windDirectionAngle'
import { DETAILS_ICON_SIZE, SmallIconSlot, WindDetailsRow } from './styled'

export const WindRow: FC<{ wind: HourWeatherForecast['wind'] }> = ({ wind }) => {
  const strongWind = shouldShowStrongWindHint(wind.speed)

  return (
    <WindDetailsRow>
      <SmallIconSlot>
        <WindIcon
          size={DETAILS_ICON_SIZE}
          strokeWidth={designTokens.icon.strokeWidth}
          color={strongWind ? 'var(--mui-palette-error-main)' : 'var(--mui-palette-air-main)'}
        />
      </SmallIconSlot>
      <span>{wind.speed.toFixed(0)}</span> <Unit>m/s</Unit>
      {wind.direction !== null ? (
        <SmallIconSlot>
          <ArrowUp
            size={DETAILS_ICON_SIZE - 4}
            strokeWidth={designTokens.icon.strokeWidth}
            style={{ transform: `rotate(${windDirectionAngle(wind.direction)}deg)` }}
          />
        </SmallIconSlot>
      ) : null}
    </WindDetailsRow>
  )
}
