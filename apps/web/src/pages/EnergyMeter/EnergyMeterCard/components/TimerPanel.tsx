import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { type FC, type MouseEvent, useCallback, useEffect, useState } from 'react'
import { useTranslations } from '@/i18n'
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
  const { t } = useTranslations()
  const labels = t.energyMeter.timer
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
      <SectionField label={labels.label}>
        <ToggleButtonGroup
          exclusive
          size='large'
          pill
          disabled={noLimit}
          value={timerMode}
          onChange={handleModeChange}
          aria-label={labels.modeAriaLabel}
          fullWidth
          sx={{ mb: 3 }}
        >
          <ToggleButton value='no-limit'>{labels.noLimit}</ToggleButton>
          <ToggleButton value='with-timer'>{labels.withTimer}</ToggleButton>
        </ToggleButtonGroup>
      </SectionField>

      {timerMode === 'with-timer' ? (
        <SectionField label={labels.targetTime}>
          <TargetTimePicker value={targetTime} onChange={handleTargetTimeChange} />
        </SectionField>
      ) : null}
    </BorderedPanel>
  )
}
