import { Box } from '@mui/material'
import { type FC } from 'react'
import { DurationRing } from './DurationRing'

type DurationPanelProps = {
  onStart?: () => void
  onStop?: () => void
}

export const DurationPanel: FC<DurationPanelProps> = ({ onStart, onStop }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 1, lg: 0 } }}>
    <DurationRing duration='01:23:45' progress={0.69} onStart={onStart} onStop={onStop} />
  </Box>
)
