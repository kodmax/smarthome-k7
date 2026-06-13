import { Grid } from '@mui/material'
import { Indoor } from './cards/Indoor'
import { Energy } from './cards/Energy'
import { Temperature } from './cards/Temperature'
import { TopTorrents } from './cards/TopTorrents'
import { Weather, WeatherForecast, HourlyWeatherForecast } from './cards/Weather'
import { useRef, type FC } from 'react'
import { Jobs } from './cards/Jobs'
import { StockMarket } from './cards/stock-market'
import { News } from './cards/News'

export const Dashboard: FC<Record<string, never>> = () => {
  const div = useRef<HTMLDivElement>(null)

  return (
    <div>
      <Grid container spacing={2} ref={div}>
        <Grid item xs={12} sm={6} md={3} xl={3}>
          <Energy />
        </Grid>
        <Grid item xs={6} sm={6} md={3} xl={3}>
          <Indoor />
        </Grid>
        <Grid item xs={6} sm={6} md={3} xl={3}>
          <Temperature />
        </Grid>
        <Grid item xs={6} sm={6} md={3} xl={3}>
          <Weather />
        </Grid>
        <Grid item xs={12} sm={12} md={12} xl={12}>
          <WeatherForecast />
        </Grid>
        <Grid item xs={12} sm={12} md={3} xl={3}>
          <TopTorrents />
        </Grid>
        <Grid item xs={6} sm={6} md={9} xl={9}>
          <HourlyWeatherForecast />
        </Grid>
        <Grid item xs={12} sm={12} md={3} xl={3}>
          <Jobs />
        </Grid>
        <Grid item xs={12} sm={12} md={3} xl={3}>
          <StockMarket />
        </Grid>
        <Grid item xs={12} sm={12} md={6} xl={6}>
          <News />
        </Grid>
      </Grid>
    </div>
  )
}
