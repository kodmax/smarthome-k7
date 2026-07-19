import { NightIcon, SunIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { Unit } from '@/card-components'
import { DETAILS_ICON_SIZE, SmallIconSlot, SunRowContainer, ValueWithUnit } from './styled'
import { sunIconColor, mutedIconColor } from './hourRowIconColors'

const sunAltitudeColorRange = { lowest: -6, optimal: 30, highest: 50 } as const
const civilTwilightAltitude = sunAltitudeColorRange.lowest

export const SunRow: FC<{ sunAltitude: number; uv: number }> = ({ sunAltitude, uv }) => {
  const iconColor = sunIconColor(uv)

  if (sunAltitude < civilTwilightAltitude) {
    return (
      <SunRowContainer>
        <SmallIconSlot>
          <NightIcon size={DETAILS_ICON_SIZE} strokeWidth={designTokens.icon.strokeWidth} color={mutedIconColor} />
        </SmallIconSlot>
      </SunRowContainer>
    )
  }

  return (
    <SunRowContainer>
      <SmallIconSlot>
        <SunIcon size={DETAILS_ICON_SIZE} strokeWidth={designTokens.icon.strokeWidth} color={iconColor} />
      </SmallIconSlot>
      <ValueWithUnit>
        <span>{uv}</span> <Unit>UVI</Unit>
      </ValueWithUnit>
    </SunRowContainer>
  )
}
