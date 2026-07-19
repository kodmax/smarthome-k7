import { designTokens } from '@repo/design-tokens'
import { PrecipType } from '@repo/types'
import { type FC } from 'react'
import { Unit } from '@/card-components'
import { precipTypeIcon } from '../../precipTypeIcons'
import { DETAILS_ICON_SIZE, DetailsRow } from './styled'

export const PrecipRow: FC<{ precipType: PrecipType; precip: string }> = ({ precipType, precip }) => {
  const PrecipIcon = precipTypeIcon(precipType)

  return (
    <DetailsRow>
      <PrecipIcon size={DETAILS_ICON_SIZE} strokeWidth={designTokens.icon.strokeWidth} />
      <span>{precip.replace('%', '')}</span> <Unit>%</Unit>
    </DetailsRow>
  )
}
