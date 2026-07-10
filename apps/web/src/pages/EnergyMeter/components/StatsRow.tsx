import { Box } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { ConsumptionIcon } from '@repo/assets'
import { Banknote, Zap } from 'lucide-react'
import { type FC } from 'react'
import { StatItem } from './StatItem'
import { KnxReading } from 'js-knx'
import { formatNumber } from '@/helpers/formatNumber'
import { EnergyRates } from '@repo/types'

export const StatsRow: FC<{ meterReading: KnxReading<number> | undefined; energyRates: EnergyRates | undefined }> = ({
  meterReading,
  energyRates,
}) => {
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
      <StatItem icon={Zap} label='Średnia moc' value='127 W' />
    </Box>
  )
}
