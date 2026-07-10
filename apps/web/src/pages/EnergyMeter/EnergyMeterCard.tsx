import { Card, Grid } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { CardHeader } from './components/CardHeader'
import { CurrentPowerPanel } from './components/CurrentPowerPanel'
import { DurationPanel } from './components/DurationPanel'
import { StatsRow } from './components/StatsRow'
import { TimerPanel } from './components/TimerPanel'
import { Box } from '@mui/system'
import { useFeed } from '@repo/feed-client'
import { EnergyFeed } from '@repo/types'

export const EnergyMeterCard: FC<Record<string, never>> = () => {
  const feed = useFeed<EnergyFeed>('energy')

  return (
    <Card
      sx={{
        borderRadius: `${designTokens.radius['2xl']}px`,
        p: {
          xs: `${designTokens.layout.paddingMobile}px`,
          md: `${designTokens.layout.paddingTablet}px`,
        },
      }}
    >
      <CardHeader energyRates={feed?.cost.rates} />

      <Grid container spacing={3} sx={{ mb: 4, alignItems: 'center' }}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <CurrentPowerPanel currentPower={feed?.instant.reading.value} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <DurationPanel />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <TimerPanel />
        </Grid>
      </Grid>
      <Box sx={{ pb: `${designTokens.components.statsRow.bottomSpacing}px` }} />
      <StatsRow meterReading={feed?.meter.reading} energyRates={feed?.cost.rates} />
    </Card>
  )
}
