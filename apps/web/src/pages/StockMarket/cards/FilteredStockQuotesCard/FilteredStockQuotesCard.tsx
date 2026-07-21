import { StockMarketIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { StockMarketFeed } from '@repo/types'
import { type FC, useCallback, useState } from 'react'
import { useTranslations } from '@/i18n'
import { StockQuotes } from '../components/StockQuotes'
import { DEFAULT_STOCK_QUOTES_FILTER, type StockQuotesFilter } from './stockQuotesFilter'
import { StockQuotesFilterSelect } from './StockQuotesFilterSelect'
import { useSortedTickers } from './useSortedTickers'

export const FilteredStockQuotesCard: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const [filter, setFilter] = useState<StockQuotesFilter>(DEFAULT_STOCK_QUOTES_FILTER)
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed, filter)

  const onFilterChange = useCallback((nextFilter: StockQuotesFilter) => {
    setFilter(nextFilter)
  }, [])

  return (
    <StockQuotes
      cardId='filtered-stock-quotes'
      title={t.stockMarket.screener.title}
      icon={StockMarketIcon}
      tickers={tickers}
      height={16}
      headingInfo={<StockQuotesFilterSelect value={filter} onChange={onFilterChange} />}
    />
  )
}
