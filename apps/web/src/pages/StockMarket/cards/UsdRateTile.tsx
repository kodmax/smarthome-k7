import { StockMarketIcon } from '@repo/assets'
import { SingleValueCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { FxRatesFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

const formatQuoteChange = (netChange: number, percentageChange: number): string => {
  const netSign = netChange > 0 ? '+' : ''
  const percentageSign = percentageChange > 0 ? '+' : ''
  return `${netSign}${netChange.toFixed(4)} (${percentageSign}${percentageChange.toFixed(2)}%)`
}

const getSecondaryColor = (netChange: number): string => {
  if (netChange > 0) return 'success.main'
  if (netChange < 0) return 'error.main'
  return 'text.secondary'
}

export const UsdRateTile: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<FxRatesFeed>('fx-rates')
  const quote = feed?.usdPln

  return (
    <SingleValueCard
      cardId='fx-rates-usd-pln'
      title={t.stockMarket.forex.usdPln.title}
      icon={StockMarketIcon}
      primary={quote ? quote.price.toFixed(4) : '--'}
      secondary={quote ? formatQuoteChange(quote.netChange, quote.percentageChange) : '--'}
      secondaryColor={quote ? getSecondaryColor(quote.netChange) : 'text.secondary'}
    />
  )
}
