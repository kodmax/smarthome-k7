import { Box, IconButton, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { type FC, useCallback } from 'react'

type DurationParts = {
  hours: number
  minutes: number
  seconds: number
}

type TargetTimePickerProps = {
  value: string
  onChange: (value: string) => void
}

type DurationUnit = keyof DurationParts

const UNIT_LIMITS: Record<DurationUnit, { min: number; max: number }> = {
  hours: { min: 0, max: 99 },
  minutes: { min: 0, max: 59 },
  seconds: { min: 0, max: 59 },
}

const UNIT_LABELS: Record<DurationUnit, string> = {
  hours: 'godz',
  minutes: 'min',
  seconds: 'sek',
}

export const parseTargetTime = (value: string): DurationParts => {
  const [hours = '0', minutes = '0', seconds = '0'] = value.split(':')

  return {
    hours: clampNumber(Number.parseInt(hours, 10), UNIT_LIMITS.hours.min, UNIT_LIMITS.hours.max),
    minutes: clampNumber(Number.parseInt(minutes, 10), UNIT_LIMITS.minutes.min, UNIT_LIMITS.minutes.max),
    seconds: clampNumber(Number.parseInt(seconds, 10), UNIT_LIMITS.seconds.min, UNIT_LIMITS.seconds.max),
  }
}

export const formatTargetTime = ({ hours, minutes, seconds }: DurationParts) =>
  [hours, minutes, seconds].map(part => String(part).padStart(2, '0')).join(':')

const clampNumber = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) {
    return min
  }

  return Math.min(max, Math.max(min, value))
}

const stepValue = (value: number, delta: number, min: number, max: number) => {
  const range = max - min + 1
  return min + ((((value - min + delta) % range) + range) % range)
}

type DurationStepperProps = {
  unit: DurationUnit
  value: number
  onChange: (value: number) => void
}

const DurationStepper: FC<DurationStepperProps> = ({ unit, value, onChange }) => {
  const { min, max } = UNIT_LIMITS[unit]

  const handleStep = useCallback(
    (delta: number) => {
      onChange(stepValue(value, delta, min, max))
    },
    [max, min, onChange, value],
  )

  return (
    <Box sx={{ flex: '0 0 3em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      <IconButton
        aria-label={`Zwiększ ${UNIT_LABELS[unit]}`}
        onClick={() => handleStep(1)}
        size='large'
        sx={{
          color: 'text.secondary',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: `${designTokens.radius.md}px`,
        }}
      >
        <ChevronUp size={designTokens.icon.sizeAction} strokeWidth={designTokens.icon.strokeWidth} />
      </IconButton>

      <Typography
        aria-label={`${UNIT_LABELS[unit]}: ${String(value).padStart(2, '0')}`}
        variant='timerDigit'
        sx={{
          minWidth: '2.5ch',
          textAlign: 'center',
          mt: 1,
          mb: 0.5,
        }}
      >
        {String(value).padStart(2, '0')}
      </Typography>

      <IconButton
        aria-label={`Zmniejsz ${UNIT_LABELS[unit]}`}
        onClick={() => handleStep(-1)}
        size='large'
        sx={{
          color: 'text.secondary',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: `${designTokens.radius.md}px`,
        }}
      >
        <ChevronDown size={designTokens.icon.sizeAction} strokeWidth={designTokens.icon.strokeWidth} />
      </IconButton>

      <Typography variant='caption' sx={{ mt: 0.5 }}>
        {UNIT_LABELS[unit]}
      </Typography>
    </Box>
  )
}

export const TargetTimePicker: FC<TargetTimePickerProps> = ({ value, onChange }) => {
  const duration = parseTargetTime(value)

  const handleUnitChange = useCallback(
    (unit: DurationUnit, nextValue: number) => {
      onChange(formatTargetTime({ ...duration, [unit]: nextValue }))
    },
    [duration, onChange],
  )

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        px: 1,
        py: 1.5,
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${designTokens.radius.lg}px`,
        bgcolor: 'background.default',
      }}
    >
      <DurationStepper
        unit='hours'
        value={duration.hours}
        onChange={nextValue => handleUnitChange('hours', nextValue)}
      />

      <Typography variant='timerDigit' sx={{ color: 'text.secondary', pb: 5 }}>
        :
      </Typography>

      <DurationStepper
        unit='minutes'
        value={duration.minutes}
        onChange={nextValue => handleUnitChange('minutes', nextValue)}
      />

      {/* <Typography variant='timerDigit' sx={{ color: 'text.secondary', pb: 5 }}>
        :
      </Typography>

      <DurationStepper
        unit='seconds'
        value={duration.seconds}
        onChange={nextValue => handleUnitChange('seconds', nextValue)}
      /> */}
    </Box>
  )
}
