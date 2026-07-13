import { Grid } from '@mui/material'
import { ZoomStateProvider } from '@repo/apollo-card'
import { type FC } from 'react'
import { PageWrapper } from '@/app/components/PageWrapper'
import { Indoor } from './cards/Indoor'
import { Energy } from './cards/Energy'
import { Temperature } from './cards/Temperature'
import { TopTorrents } from './cards/TopTorrents'
import { Weather, WeatherForecast, HourlyWeatherForecast } from './cards/Weather'
import { Jobs } from './cards/Jobs'
import { StockMarket } from './cards/stock-market'
import { News } from './cards/News'

const dashboardMdOrder = (md: number) => ({ order: { md, xl: 0 } })

export const Dashboard: FC<Record<string, never>> = () => {
  return (
    <PageWrapper>
      <ZoomStateProvider>
        <Grid container spacing={3} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, md: 6, xl: 3 }} sx={dashboardMdOrder(1)}>
            <Energy />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 3 }} sx={dashboardMdOrder(2)}>
            <Indoor />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 3 }} sx={dashboardMdOrder(3)}>
            <Temperature />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 3 }} sx={dashboardMdOrder(4)}>
            <Weather />
          </Grid>
          <Grid size={12} sx={dashboardMdOrder(5)}>
            <WeatherForecast />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 4 }} sx={dashboardMdOrder(7)}>
            <TopTorrents />
          </Grid>
          <Grid size={{ xs: 12, xl: 8 }} sx={dashboardMdOrder(6)}>
            <HourlyWeatherForecast />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 4 }} sx={dashboardMdOrder(8)}>
            <Jobs />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 4 }} sx={dashboardMdOrder(9)}>
            <StockMarket />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 4 }} sx={dashboardMdOrder(10)}>
            <News />
          </Grid>
        </Grid>
      </ZoomStateProvider>
    </PageWrapper>
  )
}
