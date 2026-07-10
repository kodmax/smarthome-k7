import { Box } from '@mui/material'
import { ConsumptionIcon } from '@repo/assets'
import { Banknote, Zap } from 'lucide-react'
import { type FC } from 'react'
import { StatItem } from './StatItem'

export const StatsRow: FC<Record<string, never>> = () => (
  <Box sx={{ display: 'flex', gap: '4em', justifyContent: 'center' }}>
    <Box>
      <StatItem icon={ConsumptionIcon} label='Zużyta energia' value='0,176 kWh' />
    </Box>
    <Box>
      <StatItem icon={Banknote} label='Łączny koszt' value='0,15 zł' />
    </Box>
    <Box>
      <StatItem icon={Zap} label='Średnia moc' value='127 W' />
    </Box>
  </Box>
)
