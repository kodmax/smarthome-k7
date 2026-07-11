import { Box } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { ConsumptionIcon } from '@repo/assets'
import { Banknote } from 'lucide-react'
import { type FC } from 'react'
import { StatItem } from './StatItem'
import { KnxReading } from 'js-knx'
import { formatNumber } from '@/helpers/formatNumber'
import { EnergyRates } from '@repo/types'

type Props = {
  meterReading: KnxReading<number>
  energyRates: EnergyRates
}

export const StatsRow: FC<Props> = ({ meterReading, energyRates }) => {
  const grossPrice =
    energyRates !== undefined ? (energyRates.distribution + energyRates.energy) * energyRates.vat : undefined

  const cost =
    meterReading !== undefined && grossPrice !== undefined
      ? formatNumber((meterReading.value / 1000) * grossPrice, { fractionDigits: 4 })
      : undefined

  const consumedEnergy = meterReading !== undefined ? formatNumber(meterReading.value) : '--'
  return (
    <Box sx={{ display: 'flex', gap: `${designTokens.components.statsRow.gap}px`, justifyContent: 'center' }}>
      <StatItem icon={ConsumptionIcon} label='Zużyta energia' value={`${consumedEnergy} Wh`} />
      <StatItem icon={Banknote} label='Łączny koszt' value={`${cost} zł`} />
    </Box>
  )
}
