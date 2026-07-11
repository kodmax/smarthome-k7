import { Box, Card, CircularProgress, Grid } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { useCallback, useEffect, useState, type FC } from 'react'
import { CardHeader } from './components/CardHeader'
import { CurrentPowerPanel } from './components/CurrentPowerPanel'
import { DurationPanel } from './components/DurationPanel'
import { StatsRow } from './components/StatsRow'
import { TimerPanel } from './components/TimerPanel'
import { useCommand, useFeed } from '@repo/feed-client'
import { EnergyFeed } from '@repo/types'
import { MeterStatus } from './types'
import { useStopwatch } from './useStopwatch'

const cardSx = {
  borderRadius: `${designTokens.radius['2xl']}px`,
  p: {
    xs: `${designTokens.layout.paddingMobile}px`,
    md: `${designTokens.layout.paddingTablet}px`,
  },
} as const

const REFRESH_INTERVAL = 3000

export const EnergyMeterCard: FC<Record<string, never>> = () => {
  const [timeLimit, setTimeLimit] = useState<number>()
  const [progress, setProgress] = useState<number>()

  const [status, setStatus] = useState<MeterStatus>('stopped')
  const duration = useStopwatch(status)

  const feed = useFeed<EnergyFeed>('energy')
  const requestReadings = useCommand('energy.meter', 'request-readings')

  const reset = useCommand('energy.meter', 'reset')
  const start = useCommand('energy.meter', 'start')
  const stop = useCommand('energy.meter', 'stop')

  const onStart = useCallback(() => {
    setStatus('started')
    reset()
    start()
  }, [start])

  const onStop = useCallback(() => {
    setStatus('stopped')
    stop()
  }, [stop])

  useEffect(() => {
    reset()
  }, [])

  useEffect(() => {
    if (feed === undefined) {
      return
    }

    const id = setInterval(() => requestReadings(''), REFRESH_INTERVAL)
    return () => {
      clearInterval(id)
    }
  }, [feed])

  useEffect(() => {
    if (timeLimit === undefined) {
      setProgress(undefined)
      return
    }

    if (duration >= timeLimit) {
      setProgress(1)
      onStop()
      return
    }

    setProgress(status === 'started' ? duration / timeLimit : 0)
  }, [timeLimit, duration, status, stop])

  if (feed === undefined) {
    return (
      <Card sx={cardSx}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 420,
          }}
        >
          <CircularProgress size={32} />
        </Box>
      </Card>
    )
  }

  return (
    <Card sx={cardSx}>
      <CardHeader energyRates={feed.cost.rates} status={status} />

      <Grid container spacing={3} sx={{ mb: 4, alignItems: 'center' }}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <CurrentPowerPanel currentPower={feed.instant.reading.value} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <DurationPanel
            duration={duration}
            progress={progress}
            isRunning={status === 'started'}
            onStart={onStart}
            onStop={onStop}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <TimerPanel onChange={setTimeLimit} noLimit={status === 'started' && timeLimit === undefined} />
        </Grid>
      </Grid>
      <Box sx={{ pb: `${designTokens.components.statsRow.bottomSpacing}px` }} />
      <StatsRow meterReading={feed.meter.reading} energyRates={feed.cost.rates} />
    </Card>
  )
}
