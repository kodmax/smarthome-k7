import { type FC } from 'react'
import { StockMarketIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { ApolloDataTable, ApolloTableCell, TablePlaceholder } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { StockMarketFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { Ticker } from './Ticker'
import { TableBody, TableHead, TableRow, useMediaQuery, useTheme } from '@mui/material'
import { useSortedTickers } from './useSortedTickers'
import { useMarketSession } from './useMarketSession'

const cardTableFontSize = designTokens.font.body.size
const tableHeaderGap = designTokens.space[3]
const headerRowSx = { '& .MuiTableCell-root': { pb: `${tableHeaderGap}px` } }

export const StockMarket: FC<Record<string, never>> = () => {
  const theme = useTheme()
  const isBelowXl = useMediaQuery(theme.breakpoints.down('xl'))
  const cardHeight = isBelowXl ? 6 : 4
  const zoom = useZoom('stock-market')
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed)
  const marketSession = useMarketSession(feed?.marketInfo)
  const { t } = useTranslations()
  const labels = t.dashboard.stockMarket

  if (feed === undefined || tickers === undefined || marketSession === undefined) {
    return (
      <ApolloCard cardId='stock-market' title={labels.title} icon={StockMarketIcon} height={cardHeight}>
        <TablePlaceholder rows={12} graph={false} value={true} />
      </ApolloCard>
    )
  }

  return (
    <ApolloCard
      cardId='stock-market'
      title={labels.title}
      icon={StockMarketIcon}
      height={cardHeight}
      headingInfo={marketSession.countdown}
    >
      <ApolloDataTable style={{ fontSize: cardTableFontSize, lineHeight: zoom ? 2 : undefined }}>
        {zoom ? (
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
        ) : null}
        <TableBody>
          {tickers.map(item => (
            <Ticker key={item.symbol} ticker={item} zoom={zoom} />
          ))}
        </TableBody>
      </ApolloDataTable>
    </ApolloCard>
  )
}
