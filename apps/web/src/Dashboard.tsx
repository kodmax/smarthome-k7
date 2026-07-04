import { Grid } from '@mui/material'
import { Indoor } from './cards/Indoor'
import { Energy } from './cards/Energy'
import { Temperature } from './cards/Temperature'
import { TopTorrents } from './cards/TopTorrents'
import { Weather, WeatherForecast, HourlyWeatherForecast } from './cards/Weather'
import { type FC } from 'react'
import { Jobs } from './cards/Jobs'
import { StockMarket } from './cards/stock-market'
import { News } from './cards/News'

export const Dashboard: FC<Record<string, never>> = () => {
  return (
    <div>
      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Energy />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Indoor />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Temperature />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Weather />
        </Grid>
        <Grid size={12}>
          <WeatherForecast />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TopTorrents />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <HourlyWeatherForecast />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Jobs />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StockMarket />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <News />
        </Grid>
      </Grid>
    </div>
  )
}
