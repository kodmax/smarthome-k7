import { Box, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { statusSx } from './styles'

type MeterStatusProps = {
  total: number
}

export const MeterStatus: FC<MeterStatusProps> = ({ total }) => {
  const isActive = total > 0

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
