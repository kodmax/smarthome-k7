import { Box } from '@mui/material'
import { type FC } from 'react'
import { DurationRing } from './DurationRing'

export const DurationPanel: FC<Record<string, never>> = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 1, lg: 0 } }}>
    <DurationRing duration='01:23:45' progress={0.69} />
  </Box>
)
