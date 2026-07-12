import { Box, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'
import { MeterStatus } from '../../../types'

type MeterStatusProps = {
  status: MeterStatus
}

const statusColor: Record<MeterStatus, string> = {
  reset: 'text.disabled',
  started: 'energy.main',
  stopped: 'secondary.main',
}

export const MeterStatusDisplay: FC<MeterStatusProps> = ({ status }) => {
  const { t } = useTranslations()
  const statusText = t.energyMeter.meterStatus[status]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: designTokens.components.statusDot.size,
          height: designTokens.components.statusDot.size,
          borderRadius: '50%',
          bgcolor: statusColor[status],
        }}
      />
      <Typography variant='status' sx={{ color: statusColor[status] }}>
        {statusText}
      </Typography>
    </Box>
  )
}
