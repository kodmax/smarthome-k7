import { Box, Button, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { Play, RotateCcw, Square } from 'lucide-react'
import { type FC, useCallback } from 'react'
import { SectionLabel } from './SectionLabel'

type DurationRingProps = {
  elapsedSeconds: number
  progress: number | undefined
  isRunning: boolean
  onStart?: () => void
  onStop?: () => void
  onReset?: () => void
}

const { progressRing } = designTokens.components
const SIZE = progressRing.size
const STROKE = progressRing.strokeWidth
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ARC_DEGREES = progressRing.arcDegrees
const ARC_LENGTH = CIRCUMFERENCE * (ARC_DEGREES / 360)
const GAP_DEGREES = 360 - ARC_DEGREES
const RING_ROTATION = 90 + GAP_DEGREES / 2

const formatStopwatch = (elapsedSeconds: number): string => {
  const hours = Math.floor(elapsedSeconds / 3600)
  const minutes = Math.floor((elapsedSeconds % 3600) / 60)
  const seconds = elapsedSeconds % 60

  return [hours, minutes, seconds].map(part => String(part).padStart(2, '0')).join(':')
}

export const DurationRing: FC<DurationRingProps> = ({
  elapsedSeconds,
  progress,
  isRunning,
  onStart,
  onStop,
  onReset,
}) => {
  const handleToggle = useCallback(() => {
    if (isRunning) {
      onStop?.()
    } else {
      onStart?.()
    }
  }, [isRunning, onStart, onStop])

  const progressLength = progress !== undefined ? ARC_LENGTH * progress : undefined
  const center = SIZE / 2
  const ringTransform = `rotate(${RING_ROTATION} ${center} ${center})`
  const ringDasharray = `${ARC_LENGTH} ${CIRCUMFERENCE}`
  const progressDasharray = progressLength !== undefined ? `${progressLength} ${CIRCUMFERENCE}` : undefined

  return (
    <Box
      sx={{
        position: 'relative',
        width: SIZE,
        maxWidth: '100%',
        mx: 'auto',
      }}
    >
      <Box
        component='svg'
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        sx={{
          display: 'block',
          width: '100%',
          height: 'auto',
        }}
      >
        <circle
          cx={center}
          cy={center}
          r={RADIUS}
          fill='none'
          stroke='var(--mui-palette-divider)'
          strokeWidth={STROKE}
          strokeLinecap='round'
          strokeDasharray={ringDasharray}
          transform={ringTransform}
        />
        {progressDasharray !== undefined ? (
          <circle
            cx={center}
            cy={center}
            r={RADIUS}
            fill='none'
            stroke='var(--mui-palette-energy-main)'
            strokeWidth={STROKE}
            strokeLinecap='round'
            strokeDasharray={progressDasharray}
            transform={ringTransform}
          />
        ) : null}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 5,
          textAlign: 'center',
          pt: 8,
        }}
      >
        <SectionLabel>Czas trwania</SectionLabel>

        <Typography variant='timerValue' sx={{ mb: 0.5 }}>
          {formatStopwatch(elapsedSeconds)}
        </Typography>

        <Typography variant='caption' sx={{ mb: 2 }}>
          godz : min : sek
        </Typography>

        <Box
          sx={{
            px: `${progressRing.controlsPaddingX}px`,
            pt: `${progressRing.controlsPaddingTop}px`,
          }}
        >
          <Button
            variant='contained'
            color={isRunning ? 'error' : 'temperature'}
            size='large'
            fullWidth
            onClick={handleToggle}
            startIcon={
              isRunning ? (
                <Square size={designTokens.icon.sizeAction} fill='currentColor' strokeWidth={0} />
              ) : (
                <Play size={designTokens.icon.sizeAction} fill='currentColor' strokeWidth={0} />
              )
            }
            sx={{
              mb: 1.5,
              fontWeight: 700,
              ...(!isRunning && {
                '&:hover': {
                  filter: 'brightness(0.92)',
                },
              }),
            }}
          >
            {isRunning ? 'STOP' : 'START'}
          </Button>
          <Button
            variant='text'
            size='large'
            fullWidth
            onClick={onReset}
            disabled={isRunning}
            startIcon={<RotateCcw size={designTokens.icon.sizeAction} strokeWidth={designTokens.icon.strokeWidth} />}
            sx={{
              fontWeight: 500,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            Zeruj
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
