import { Grid } from '@mui/material'
import { cardGridSpacing } from '@repo/design-tokens'
import { StockMarketIcon, iconStyles } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/components/PageHeader'
import { PageWrapper } from '@/app/components/PageWrapper'
import {
  MarketIndexTile,
  MarketStatusTile,
  QuotesOverviewCard,
  TomorrowEarningsTile,
  UsdRateTile,
} from '@/pages/StockMarket/cards'
import { useTranslations } from '@/i18n'

export const StockMarket: FC<Record<string, never>> = () => {
  const { t } = useTranslations()

  return (
    <PageWrapper>
      <PageHeader
        icon={StockMarketIcon}
        iconColor={iconStyles.energy.color}
        title={t.stockMarket.title}
        description={t.stockMarket.description}
      />

      <Grid container spacing={cardGridSpacing} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <MarketStatusTile />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
          <MarketIndexTile indexKey='sp500' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
          <MarketIndexTile indexKey='sp500Futures' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
          <UsdRateTile />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <TomorrowEarningsTile />
        </Grid>
        <Grid size={{ xs: 12, md: 8, lg: 6, xl: 4 }}>
          <QuotesOverviewCard />
        </Grid>
      </Grid>
    </PageWrapper>
  )
}
