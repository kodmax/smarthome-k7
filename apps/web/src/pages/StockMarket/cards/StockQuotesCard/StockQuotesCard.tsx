import { PowerIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { StockMarketFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'
import { useSortedTickers } from '@/pages/Dashboard/cards/stock-market/useSortedTickers'
import { StockQuotes } from '../components/StockQuotes'

export const StockQuotesCard: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed)

  return (
    <StockQuotes cardId='stock-quotes' title={t.stockQuotes.title} icon={PowerIcon} tickers={tickers} height={24} />
  )
}
