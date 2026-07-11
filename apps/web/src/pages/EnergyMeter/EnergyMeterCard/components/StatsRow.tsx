import { Box } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { ConsumptionIcon } from '@repo/assets'
import { Banknote, Zap } from 'lucide-react'
import { useMemo, useRef, type FC } from 'react'
import { StatItem } from './components'
import { formatNumber } from '@/helpers/formatNumber'
import { EnergyRates } from '@repo/types'

type Props = {
  meterReading: number
  energyRates: EnergyRates
  elapsed: number
}

export const StatsRow: FC<Props> = ({ meterReading, energyRates, elapsed }) => {
  const elapsedRef = useRef(elapsed)
  elapsedRef.current = elapsed

  const grossPrice =
    energyRates !== undefined ? (energyRates.distribution + energyRates.energy) * energyRates.vat : undefined

  const cost =
    meterReading !== undefined && grossPrice !== undefined
      ? formatNumber((meterReading / 1000) * grossPrice, { fractionDigits: 4 })
      : undefined

  const consumedEnergy = meterReading !== undefined ? formatNumber(meterReading) : '--'

  const avgPower = useMemo(() => {
    return elapsedRef.current > 0
      ? formatNumber((meterReading / elapsedRef.current) * 3600, { fractionDigits: 0 })
      : undefined
  }, [meterReading])

  return (
    <Box sx={{ display: 'flex', gap: `${designTokens.components.statsRow.gap}px`, justifyContent: 'center' }}>
      <StatItem icon={ConsumptionIcon} label='Zużyta energia' value={`${consumedEnergy} Wh`} />
      <StatItem icon={Banknote} label='Łączny koszt' value={`${cost} zł`} />
      {avgPower !== undefined ? <StatItem icon={Zap} label='Średnia moc' value={`${avgPower} W`} /> : null}
    </Box>
  )
}
