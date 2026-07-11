import { Box, Grid } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { useCallback, useEffect, useState, type FC } from 'react'
import { CardHeader, CurrentPowerPanel, DurationPanel, StatsRow, TimerPanel } from './components'
import { useCommand } from '@repo/feed-client'
import { EnergyFeed } from '@repo/types'
import { MeterStatus } from '../types'
import { useStopwatch } from '../useStopwatch'

const REFRESH_INTERVAL = 3000

export const CardContent: FC<{ feed: EnergyFeed }> = ({ feed }) => {
  const [timeLimit, setTimeLimit] = useState<number>()
  const [progress, setProgress] = useState<number>()

  const [status, setStatus] = useState<MeterStatus>('reset')
  const duration = useStopwatch(status)

  const requestReadings = useCommand('energy.meter', 'request-readings')

  const reset = useCommand('energy.meter', 'reset')
  const start = useCommand('energy.meter', 'start')
  const stop = useCommand('energy.meter', 'stop')

  const onStart = useCallback(() => {
    setStatus('started')
    start()
  }, [start])

  const onStop = useCallback(() => {
    setStatus('stopped')
    stop()
  }, [stop])

  const onReset = useCallback(() => {
    setStatus('reset')
    reset()
  }, [reset])

  useEffect(() => {
    reset()
  }, [])

  useEffect(() => {
    const id = setInterval(() => requestReadings(''), REFRESH_INTERVAL)
    return () => {
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (timeLimit === undefined) {
      setProgress(undefined)
      return
    }

    if (status === 'started' && duration >= timeLimit) {
      setProgress(1)
      onStop()
      return
    }

    setProgress(status === 'started' ? duration / timeLimit : 0)
  }, [timeLimit, duration, status, stop])

  return (
    <>
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
            onReset={onReset}
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
    </>
  )
}
