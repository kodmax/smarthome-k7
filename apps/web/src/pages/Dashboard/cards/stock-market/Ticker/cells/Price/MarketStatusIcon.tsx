import { NightIcon, SunriseIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { MarketStatus } from '@repo/types'
import { Circle } from 'lucide-react'
import { FC } from 'react'

const iconStyle = { verticalAlign: 'middle' as const }
const iconSize = designTokens.icon.sizeXs - 4

export const MarketStatusIcon: FC<{ marketStatus: MarketStatus }> = ({ marketStatus }) => {
  switch (marketStatus) {
    case 'Open':
      return (
        <Circle size={iconSize} fill='var(--mui-palette-success-main)' strokeWidth={0} style={iconStyle} aria-hidden />
      )

    case 'After-Hours':
      return <NightIcon size={iconSize} strokeWidth={designTokens.icon.strokeWidth} style={iconStyle} aria-hidden />

    case 'Pre-Market':
      return <SunriseIcon size={iconSize} strokeWidth={designTokens.icon.strokeWidth} style={iconStyle} aria-hidden />

    case 'Closed':
      return (
        <Circle size={iconSize} fill='var(--mui-palette-text-disabled)' strokeWidth={0} style={iconStyle} aria-hidden />
      )

    default:
      return <>{marketStatus}</>
  }
}
