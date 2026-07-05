import { type FC } from 'react'
import { StockMarketIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { ApolloTableCell, TablePlaceholder } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { StockMarketFeed } from '@repo/types'
import { Ticker } from './Ticker'
import { StockMarketTable } from './styled'
import { TableBody, TableHead, TableRow } from '@mui/material'
import { useSortedTickers } from './useSortedTickers'

const cardTableFontSize = designTokens.font.body.size
const tableHeaderGap = designTokens.space[3]
const headerRowSx = { '& .MuiTableCell-root': { pb: `${tableHeaderGap}px` } }

export const StockMarket: FC<Record<string, never>> = () => {
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed)

  if (feed === undefined || tickers === undefined) {
    return (
      <ApolloCard cardId='stock-market' title='Giełda' icon={StockMarketIcon} height={9}>
        <TablePlaceholder rows={12} graph={false} value={true} />
      </ApolloCard>
    )
  }

  const marketStatus = feed?.tickers.find(item => item.exchange.name === 'NYSE')?.exchange.status

  return (
    <ApolloCard cardId='stock-market' title='Giełda' icon={StockMarketIcon} height={9} headingInfo={marketStatus}>
      <ZoomContext.Consumer>
        {zoom => (
          <StockMarketTable style={{ fontSize: cardTableFontSize, lineHeight: zoom.active ? 1.2 : undefined }}>
            {zoom.active ? (
              <TableHead>
                <TableRow sx={headerRowSx}>
                  <ApolloTableCell>Ticker</ApolloTableCell>
                  <ApolloTableCell>Earnings</ApolloTableCell>
                  <ApolloTableCell>EG</ApolloTableCell>
                  <ApolloTableCell>PE@PT</ApolloTableCell>
                  <ApolloTableCell>Quote</ApolloTableCell>
                </TableRow>
              </TableHead>
            ) : null}
            <TableBody>
              {tickers.map(item => (
                <Ticker key={item.symbol} ticker={item} zoom={zoom.active} />
              ))}
            </TableBody>
          </StockMarketTable>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
