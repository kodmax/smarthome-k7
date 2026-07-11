import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC, type MouseEvent, useCallback, useEffect, useState } from 'react'
import { BorderedPanel, parseTargetTime, SectionField, TargetTimePicker } from './components'

type TimerMode = 'no-limit' | 'with-timer'

const DEFAULT_TARGET_TIME = '00:00:00'

const targetTimeToSeconds = (value: string): number => {
  const { hours, minutes, seconds } = parseTargetTime(value)

  return hours * 3600 + minutes * 60 + seconds
}

const toOnChangeValue = (timerMode: TimerMode, targetTime: string): number | undefined => {
  if (timerMode === 'no-limit') {
    return undefined
  }

  const seconds = targetTimeToSeconds(targetTime)

  return seconds === 0 ? undefined : seconds
}

type TimerPanelProps = {
  onChange?: (seconds: number | undefined) => void
  noLimit?: boolean
}

export const TimerPanel: FC<TimerPanelProps> = ({ onChange, noLimit = false }) => {
  const [timerMode, setTimerMode] = useState<TimerMode>(noLimit ? 'no-limit' : 'with-timer')
  const [targetTime, setTargetTime] = useState(DEFAULT_TARGET_TIME)

  useEffect(() => {
    if (noLimit) {
      setTimerMode('no-limit')
      onChange?.(undefined)
    }
  }, [noLimit, onChange])

  const handleTargetTimeChange = useCallback(
    (value: string) => {
      setTargetTime(value)
      onChange?.(toOnChangeValue(timerMode, value))
    },
    [onChange, timerMode],
  )

  const handleModeChange = useCallback(
    (_event: MouseEvent<HTMLElement>, value: TimerMode | null) => {
      if (noLimit || value === null) {
        return
      }

      setTimerMode(value)
      onChange?.(toOnChangeValue(value, targetTime))
    },
    [noLimit, onChange, targetTime],
  )

  return (
    <BorderedPanel>
      <SectionField label='Timer'>
        <ToggleButtonGroup
          exclusive
          disabled={noLimit}
          value={timerMode}
          onChange={handleModeChange}
          aria-label='Tryb timera'
          fullWidth
          sx={{
            mb: 3,
            bgcolor: 'background.default',
            borderRadius: `${designTokens.radius.full}px`,
            p: 0.5,
            '& .MuiToggleButton-root': {
              flex: 1,
              border: 'none',
              borderRadius: `${designTokens.radius.full}px`,
              textTransform: 'none',
              fontWeight: designTokens.components.sectionLabel.fontWeight,
              py: 1,
              color: 'text.secondary',
              '&.Mui-selected': {
                bgcolor: 'energy.main',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'energy.main',
                },
              },
            },
          }}
        >
          <ToggleButton value='no-limit'>Bez limitu</ToggleButton>
          <ToggleButton value='with-timer'>Z timerem</ToggleButton>
        </ToggleButtonGroup>
      </SectionField>

      {timerMode === 'with-timer' ? (
        <SectionField label='Czas docelowy'>
          <TargetTimePicker value={targetTime} onChange={handleTargetTimeChange} />
        </SectionField>
      ) : null}
    </BorderedPanel>
  )
}
