import { Grid } from '@mui/material'
import { StockMarketIcon, iconStyles } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/components/PageHeader'
import { PageWrapper } from '@/app/components/PageWrapper'
import { HighUpsideCard, LowForwardPECard, MarketStatusTile } from '@/pages/StockMarket/cards'
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

      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <MarketStatusTile />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 9 }} />
        <Grid size={{ xs: 12, xl: 6 }}>
          <HighUpsideCard />
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
          <LowForwardPECard />
        </Grid>
      </Grid>
    </PageWrapper>
  )
}
