import { Box } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { ConsumptionIcon } from '@repo/assets'
import { Banknote, Zap } from 'lucide-react'
import { useMemo, useRef, type FC } from 'react'
import { useTranslations } from '@/i18n'
import { StatItem } from './components'
import { formatNumber } from '@/helpers/formatNumber'
import { EnergyRates } from '@repo/types'

type Props = {
  meterReading: number
  energyRates: EnergyRates
  elapsed: number
}

export const StatsRow: FC<Props> = ({ meterReading, energyRates, elapsed }) => {
  const { t } = useTranslations()
  const labels = t.energyMeter.stats
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
      <StatItem icon={ConsumptionIcon} label={labels.consumedEnergy} value={`${consumedEnergy} Wh`} />
      <StatItem icon={Banknote} label={labels.totalCost} value={`${cost} zł`} />
      {avgPower !== undefined ? <StatItem icon={Zap} label={labels.avgPower} value={`${avgPower} W`} /> : null}
    </Box>
  )
}
