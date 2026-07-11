import { Box } from '@mui/material'
import { type FC } from 'react'
import { DurationRing } from './components'

type DurationPanelProps = {
  elapsed: number
  progress: number | undefined
  isRunning: boolean
  onReset: () => void
  onStart: () => void
  onStop: () => void
}

export const DurationPanel: FC<DurationPanelProps> = ({ elapsed, progress, isRunning, onStart, onStop, onReset }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 1, lg: 0 } }}>
      <DurationRing
        elapsedSeconds={elapsed}
        progress={progress}
        isRunning={isRunning}
        onStart={onStart}
        onStop={onStop}
        onReset={onReset}
      />
    </Box>
  )
}
