import { type FC } from 'react'
import { PowerIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { BaseCard } from '@repo/apollo-card'
import { ApolloDataTable, ApolloTableCell, TablePlaceholder } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { StockMarketFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { Ticker } from '@/pages/Dashboard/cards/stock-market/Ticker'
import { useSortedTickers } from '@/pages/Dashboard/cards/stock-market/useSortedTickers'
import { TableBody, TableHead, TableRow } from '@mui/material'

const cardTableFontSize = designTokens.font.body.size
const tableHeaderGap = designTokens.space[3]
const headerRowSx = { '& .MuiTableCell-root': { pb: `${tableHeaderGap}px` } }

export const StockQuotes: FC<Record<string, never>> = () => {
  const cardHeight = 24
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed)
  const { t } = useTranslations()
  const labels = t.dashboard.stockMarket

  if (feed === undefined || tickers === undefined) {
    return (
      <BaseCard
        cardId='stock-quotes'
        title={t.stockQuotes.title}
        icon={PowerIcon}
        height={cardHeight}
        allowZoom={false}
      >
        <TablePlaceholder rows={12} graph={false} value={true} />
      </BaseCard>
    )
  }

  return (
    <BaseCard
      cardId='stock-quotes'
      title={t.stockQuotes.title}
      icon={PowerIcon}
      height={cardHeight}
      allowZoom={false}
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
    </BaseCard>
  )
}
