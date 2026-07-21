import { FileTextIcon } from '@repo/assets'
import { SingleValueCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { StockMarketFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'
import { getTomorrowEarningsTickers } from './getTomorrowEarningsTickers'

export const TomorrowEarningsTile: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tomorrowTickers = getTomorrowEarningsTickers(feed?.tickers ?? [])
  const tickerSymbols = tomorrowTickers.map(item => item.symbol).sort()

  return (
    <SingleValueCard
      cardId='stock-market-earnings-tomorrow'
      title={t.stockMarket.earningsTomorrow.title}
      icon={FileTextIcon}
      primary={feed ? tomorrowTickers.length : '--'}
      secondary={feed ? (tickerSymbols.length > 0 ? tickerSymbols.join(', ') : '--') : '--'}
    />
  )
}
