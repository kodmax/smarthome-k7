import { Box, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { statusSx } from './styles'
import { MeterStatus } from '../../../types'

type MeterStatusProps = {
  status: MeterStatus
}

const statusText: Record<MeterStatus, string> = {
  reset: 'Wyzerowany',
  started: 'Pomiar',
  stopped: 'Zatrzymany',
}

const statusColor: Record<MeterStatus, string> = {
  reset: 'text.disabled',
  started: 'energy.main',
  stopped: 'secondary.main',
}

export const MeterStatusDisplay: FC<MeterStatusProps> = ({ status }) => {
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
      <Typography sx={{ ...statusSx, color: statusColor[status] }}>{statusText[status]}</Typography>
    </Box>
  )
}
