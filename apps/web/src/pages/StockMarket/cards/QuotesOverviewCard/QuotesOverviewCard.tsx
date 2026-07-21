import { StockMarketIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { StockMarketFeed } from '@repo/types'
import { type FC, useCallback, useState } from 'react'
import { useTranslations } from '@/i18n'
import { StockQuotes } from '../components/StockQuote/StockQuotes'
import { DEFAULT_QUOTES_OVERVIEW_VIEW, type QuotesOverviewView } from './quotesOverviewViews'
import { QuotesOverviewViewSelect } from './QuotesOverviewViewSelect'
import { useCustomColumnContent } from './useCustomColumnContent'
import { useCustomColumnTitle } from './useCustomColumnTitle'
import { useSortedTickers } from './useSortedTickers'

export const QuotesOverviewCard: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const [view, setView] = useState<QuotesOverviewView>(DEFAULT_QUOTES_OVERVIEW_VIEW)
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed, view)
  const customColumnTitle = useCustomColumnTitle(view)
  const CustomColumnContent = useCustomColumnContent(view)
  const onViewChange = useCallback((nextView: QuotesOverviewView) => {
    setView(nextView)
  }, [])

  return (
    <StockQuotes
      customColumnTitle={customColumnTitle}
      CustomColumnContent={CustomColumnContent}
      cardId='quotes-overview'
      title={t.stockMarket.quotesOverview.title}
      icon={StockMarketIcon}
      tickers={tickers}
      height={16}
      headingInfo={<QuotesOverviewViewSelect value={view} onChange={onViewChange} />}
    />
  )
}
