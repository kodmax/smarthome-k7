import { Card, Grid } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { CardHeader } from './components/CardHeader'
import { CurrentPowerPanel } from './components/CurrentPowerPanel'
import { DurationPanel } from './components/DurationPanel'
import { StatsRow } from './components/StatsRow'
import { TimerPanel } from './components/TimerPanel'
import { Box } from '@mui/system'

export const EnergyMeterCard: FC<Record<string, never>> = () => (
  <Card
    sx={{
      borderRadius: `${designTokens.radius['2xl']}px`,
      p: { xs: 2.5, md: 4 },
    }}
  >
    <CardHeader />

    <Grid container spacing={3} sx={{ mb: 4, alignItems: 'center' }}>
      <Grid size={{ xs: 12, lg: 3 }}>
        <CurrentPowerPanel />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DurationPanel />
      </Grid>
      <Grid size={{ xs: 12, lg: 3 }}>
        <TimerPanel />
      </Grid>
    </Grid>
    <Box sx={{ pb: '4em' }} />
    <StatsRow />
  </Card>
)
