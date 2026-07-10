import { Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { Pencil } from 'lucide-react'
import { type FC } from 'react'
import { BorderedPanel } from './BorderedPanel'
import { SectionField } from './SectionField'

export const TimerPanel: FC<Record<string, never>> = () => (
  <BorderedPanel>
    <SectionField label='Timer'>
      <ToggleButtonGroup
        exclusive
        value='with-timer'
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
            fontWeight: 600,
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

    <SectionField label='Czas docelowy'>
      <Button
        variant='outlined'
        fullWidth
        endIcon={<Pencil size={16} />}
        sx={{
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          mb: 2,
          fontWeight: 600,
          fontSize: 18,
          borderColor: 'divider',
          color: 'text.primary',
          borderRadius: `${designTokens.radius.lg}px`,
        }}
      >
        02:00:00
      </Button>

      <Typography variant='caption' sx={{ color: 'text.secondary' }}>
        Postęp pierścienia względem czasu docelowego.
      </Typography>
    </SectionField>
  </BorderedPanel>
)
