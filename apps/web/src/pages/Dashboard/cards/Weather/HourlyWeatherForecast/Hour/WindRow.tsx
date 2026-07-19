import { WindIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { HourWeatherForecast } from '@repo/types'
import { ArrowUp } from 'lucide-react'
import { type FC } from 'react'
import { Unit } from '@/card-components'
import { windDirectionAngle } from '../../windDirectionAngle'
import { DETAILS_ICON_SIZE, SmallIconSlot, WindDetailsRow } from './styled'
import { windIconColor } from './hourRowIconColors'

export const WindRow: FC<{ wind: HourWeatherForecast['wind'] }> = ({ wind }) => (
  <WindDetailsRow>
    <SmallIconSlot>
      <WindIcon
        size={DETAILS_ICON_SIZE}
        strokeWidth={designTokens.icon.strokeWidth}
        color={windIconColor(wind.speed)}
      />
    </SmallIconSlot>
    <span>{wind.speed}</span> <Unit>m/s</Unit>
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
