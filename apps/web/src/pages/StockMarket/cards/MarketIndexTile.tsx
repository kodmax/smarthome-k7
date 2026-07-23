import { StockMarketIcon } from '@repo/assets'
import { SingleValueCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { MarketIndices, StockMarketFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

type MarketIndexKey = keyof MarketIndices

const formatQuoteChange = (netChange: number, percentageChange: number): string => {
  const netSign = netChange > 0 ? '+' : ''
  const percentageSign = percentageChange > 0 ? '+' : ''
  return `${netSign}${netChange.toFixed(2)} (${percentageSign}${percentageChange.toFixed(2)}%)`
}

const getSecondaryColor = (netChange: number): string => {
  if (netChange > 0) return 'success.main'
  if (netChange < 0) return 'error.main'
  return 'text.secondary'
}

export const MarketIndexTile: FC<{ indexKey: MarketIndexKey }> = ({ indexKey }) => {
  const { t } = useTranslations()
  const feed = useFeed<StockMarketFeed>('stock-market')
  const quote = feed?.marketIndices[indexKey]

  return (
    <SingleValueCard
      cardId={`stock-market-index-${indexKey}`}
      title={t.stockMarket.marketIndices[indexKey].title}
      icon={StockMarketIcon}
      primary={quote ? quote.price.toFixed(2) : '--'}
      secondary={quote ? formatQuoteChange(quote.netChange, quote.percentageChange) : '--'}
      secondaryColor={quote ? getSecondaryColor(quote.netChange) : 'text.secondary'}
    />
  )
}
