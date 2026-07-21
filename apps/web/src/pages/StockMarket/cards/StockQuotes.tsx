import { type FC } from 'react'
import { StockMarketIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { ApolloCard } from '@repo/apollo-card'
import { ApolloDataTable, ApolloTableCell, TablePlaceholder } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { StockMarketFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { Ticker } from '@/pages/Dashboard/cards/stock-market/Ticker'
import { useSortedTickers } from '@/pages/Dashboard/cards/stock-market/useSortedTickers'
import { useMarketSession } from '@/pages/Dashboard/cards/stock-market/useMarketSession'
import { getMarketStatusTitle } from '@/pages/Dashboard/cards/stock-market/helpers/getMarketStatusTitle'
import { MarketStatusIcon } from '@/pages/Dashboard/cards/stock-market/Ticker/cells/Price/MarketStatusIcon'
import { Box, TableBody, TableHead, TableRow } from '@mui/material'

const cardTableFontSize = designTokens.font.body.size
const tableHeaderGap = designTokens.space[3]
const headerRowSx = { '& .MuiTableCell-root': { pb: `${tableHeaderGap}px` } }

export const StockQuotes: FC<Record<string, never>> = () => {
  const cardHeight = 24
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed)
  const marketSession = useMarketSession(feed?.marketInfo)
  const { t } = useTranslations()
  const labels = t.dashboard.stockMarket

  if (feed === undefined || tickers === undefined || marketSession === undefined) {
    return (
      <ApolloCard
        cardId='stock-quotes'
        title={t.stockQuotes.title}
        icon={StockMarketIcon}
        height={cardHeight}
        allowZoom={false}
      >
        <TablePlaceholder rows={12} graph={false} value={true} />
      </ApolloCard>
    )
  }

  const statusTitle = getMarketStatusTitle(marketSession.status, labels.status)

  return (
    <ApolloCard
      cardId='stock-quotes'
      title={t.stockQuotes.title}
      icon={StockMarketIcon}
      height={cardHeight}
      allowZoom={false}
      headingInfo={
        <Box component='span' title={statusTitle} sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <MarketStatusIcon marketStatus={marketSession.status} />
          {marketSession.countdown}
        </Box>
      }
    >
      <ApolloDataTable style={{ fontSize: cardTableFontSize, lineHeight: 2 }}>
        <TableHead>
          <TableRow sx={headerRowSx}>
            <ApolloTableCell sx={{ width: '14px' }} />
            <ApolloTableCell>{labels.symbol}</ApolloTableCell>
            <ApolloTableCell>{labels.earnings}</ApolloTableCell>
            <ApolloTableCell>{labels.pe}</ApolloTableCell>
            <ApolloTableCell>{labels.toPriceTarget}</ApolloTableCell>
            <ApolloTableCell>{labels.priceTarget}</ApolloTableCell>
            <ApolloTableCell>{labels.peAtTarget}</ApolloTableCell>
            <ApolloTableCell>{labels.quote}</ApolloTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickers.map(item => (
            <Ticker key={item.symbol} ticker={item} zoom={true} />
          ))}
        </TableBody>
      </ApolloDataTable>
    </ApolloCard>
  )
}
