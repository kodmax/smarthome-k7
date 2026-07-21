import { TrendDownIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { StockMarketFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'
import { StockQuotes } from '../components/StockQuotes'
import { useSortedTickers } from './useSortedTickers'

export const LowForwardPECard: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed)

  return (
    <StockQuotes
      cardId='low-forward-pe'
      title={t.stockMarket.lowForwardPE.title}
      icon={TrendDownIcon}
      tickers={tickers}
      height={16}
    />
  )
}
