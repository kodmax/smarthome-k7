import { SunMoonIcon } from '@repo/assets'
import { SingleValueCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { StockMarketFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'
import { useMarketSession } from '@/pages/Dashboard/cards/stock-market/useMarketSession'
import { getMarketStatusTitle } from '@/pages/Dashboard/cards/stock-market/helpers/getMarketStatusTitle'
import { MarketStatusIcon } from '@/pages/Dashboard/cards/stock-market/Ticker/cells/Price/MarketStatusIcon'

export const MarketStatusTile: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<StockMarketFeed>('stock-market')
  const marketSession = useMarketSession(feed?.marketInfo)
  const labels = t.dashboard.stockMarket

  return (
    <SingleValueCard
      cardId='stock-market-status'
      title={t.stockMarket.marketStatus.title}
      icon={SunMoonIcon}
      primary={
        marketSession ? (
          <>
            <MarketStatusIcon marketStatus={marketSession.status} />
            {getMarketStatusTitle(marketSession.status, labels.status)}
          </>
        ) : (
          '--'
        )
      }
      secondary={marketSession?.countdown ?? '--'}
    />
  )
}
