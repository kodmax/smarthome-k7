import { StockMarketIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { StockMarketFeed } from '@repo/types'
import { type FC, useCallback, useState } from 'react'
import { useTranslations } from '@/i18n'
import { StockQuotes } from '../components/StockQuote/StockQuotes'
import { DEFAULT_STOCK_QUOTES_FILTER, type StockQuotesFilter } from './stockQuotesFilter'
import { StockQuotesFilterSelect } from './StockQuotesFilterSelect'
import { useSortedTickers } from './useSortedTickers'
import { EarningsDate, EG, PEAtPT } from './cells'
import { ColumnContent } from '../components/StockQuote'

export const useCustomColumnTitle = (filter: StockQuotesFilter): string => {
  const { t } = useTranslations()
  const labels = t.dashboard.stockMarket

  switch (filter) {
    case 'earnings-soon':
      return labels.earnings

    case 'high-upside':
      return labels.toPriceTarget

    case 'low-forward-pe':
      return labels.peAtTarget
  }
}

export const useCustomColumnContent = (filter: StockQuotesFilter): ColumnContent => {
  switch (filter) {
    case 'earnings-soon':
      return EarningsDate

    case 'high-upside':
      return EG

    case 'low-forward-pe':
      return PEAtPT
  }
}

export const FilteredStockQuotesCard: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const [filter, setFilter] = useState<StockQuotesFilter>(DEFAULT_STOCK_QUOTES_FILTER)
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed, filter)
  const customColumnTitle = useCustomColumnTitle(filter)
  const CustomColumnContent = useCustomColumnContent(filter)
  const onFilterChange = useCallback((nextFilter: StockQuotesFilter) => {
    setFilter(nextFilter)
  }, [])

  return (
    <StockQuotes
      customColumnTitle={customColumnTitle}
      CustomColumnContent={CustomColumnContent}
      cardId='filtered-stock-quotes'
      title={t.stockMarket.screener.title}
      icon={StockMarketIcon}
      tickers={tickers}
      height={16}
      headingInfo={<StockQuotesFilterSelect value={filter} onChange={onFilterChange} />}
    />
  )
}
