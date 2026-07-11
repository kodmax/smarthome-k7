import { Box } from '@mui/material'
import { type FC } from 'react'
import { DurationRing } from './components'

type DurationPanelProps = {
  duration: number
  progress: number | undefined
  isRunning: boolean
  onReset: () => void
  onStart: () => void
  onStop: () => void
}

export const DurationPanel: FC<DurationPanelProps> = ({ duration, progress, isRunning, onStart, onStop, onReset }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 1, lg: 0 } }}>
    <DurationRing
      duration={duration}
      progress={progress}
      isRunning={isRunning}
      onStart={onStart}
      onStop={onStop}
      onReset={onReset}
    />
  </Box>
)
