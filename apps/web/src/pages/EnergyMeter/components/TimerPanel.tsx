import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC, type MouseEvent, useCallback, useState } from 'react'
import { BorderedPanel } from './BorderedPanel'
import { SectionField } from './SectionField'
import { TargetTimePicker } from './TargetTimePicker'

type TimerMode = 'no-limit' | 'with-timer'

const DEFAULT_TARGET_TIME = '02:00:00'

export const TimerPanel: FC<Record<string, never>> = () => {
  const [timerMode, setTimerMode] = useState<TimerMode>('with-timer')
  const [targetTime, setTargetTime] = useState(DEFAULT_TARGET_TIME)

  const handleModeChange = useCallback((_event: MouseEvent<HTMLElement>, value: TimerMode | null) => {
    if (value !== null) {
      setTimerMode(value)
    }
  }, [])

  return (
    <BorderedPanel>
      <SectionField label='Timer'>
        <ToggleButtonGroup
          exclusive
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
          <TargetTimePicker value={targetTime} onChange={setTargetTime} />
        </SectionField>
      ) : null}
    </BorderedPanel>
  )
}
