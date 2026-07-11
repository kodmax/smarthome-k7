import { Box, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { statusSx } from './styles'
import { MeterStatus } from '../types'

type MeterStatusProps = {
  status: MeterStatus
}

export const MeterStatusDisplay: FC<MeterStatusProps> = ({ status }) => {
  const isActive = status === 'started'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: designTokens.components.statusDot.size,
          height: designTokens.components.statusDot.size,
          borderRadius: '50%',
          bgcolor: isActive ? 'energy.main' : 'text.disabled',
        }}
      />
      <Typography sx={isActive ? statusSx : { ...statusSx, color: 'text.disabled' }}>
        {isActive ? 'Aktywny' : 'Bezczynny'}
      </Typography>
    </Box>
  )
}
