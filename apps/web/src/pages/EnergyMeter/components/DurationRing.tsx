import { Box, Button, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { RotateCcw, Square } from 'lucide-react'
import { type FC } from 'react'
import { timerValueSx } from './styles'
import { SectionLabel } from './SectionLabel'

type DurationRingProps = {
  duration: string
  progress: number
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

export const DurationRing: FC<DurationRingProps> = ({ duration, progress }) => {
  const progressLength = ARC_LENGTH * progress
  const center = SIZE / 2
  const ringTransform = `rotate(${RING_ROTATION} ${center} ${center})`
  const ringDasharray = `${ARC_LENGTH} ${CIRCUMFERENCE}`
  const progressDasharray = `${progressLength} ${CIRCUMFERENCE}`

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
        }}
      >
        <SectionLabel>Czas trwania</SectionLabel>

        <Typography sx={{ ...timerValueSx, mb: 0.5 }}>{duration}</Typography>

        <Typography variant='caption' sx={{ color: 'text.secondary', mb: 2 }}>
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
            color='error'
            fullWidth
            startIcon={<Square size={designTokens.icon.sizeAction} fill='currentColor' strokeWidth={0} />}
            sx={{
              mb: 1.5,
              py: 1.25,
              fontWeight: 700,
              borderRadius: `${designTokens.radius.xl}px`,
            }}
          >
            STOP
          </Button>

          <Button
            variant='outlined'
            fullWidth
            startIcon={<RotateCcw size={designTokens.icon.sizeAction} />}
            sx={{
              py: 1,
              fontWeight: designTokens.components.sectionLabel.fontWeight,
              borderRadius: `${designTokens.radius.xl}px`,
              borderColor: 'divider',
              color: 'text.primary',
            }}
          >
            ZERUJ
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
