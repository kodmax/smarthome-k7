import { type FC } from 'react'
import { StockMarketIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { ApolloDataTable, ApolloTableCell, TablePlaceholder } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { StockMarketFeed } from '@repo/types'
import { Ticker } from './Ticker'
import { TableBody, TableHead, TableRow } from '@mui/material'
import { useSortedTickers } from './useSortedTickers'

const cardTableFontSize = designTokens.font.body.size

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

  return (
    <ApolloCard cardId='stock-market' title='Giełda' icon={StockMarketIcon} height={9}>
      <ZoomContext.Consumer>
        {zoom => (
          <ApolloDataTable style={{ fontSize: cardTableFontSize, lineHeight: zoom.active ? 1.2 : undefined }}>
            {zoom.active ? (
              <TableHead>
                <TableRow>
                  <ApolloTableCell>Ticker</ApolloTableCell>
                  <ApolloTableCell>Earnings Date</ApolloTableCell>
                  <ApolloTableCell>EG</ApolloTableCell>
                  <ApolloTableCell>PE@PT</ApolloTableCell>
                  <ApolloTableCell sx={{ textAlign: 'center' }}>Price</ApolloTableCell>
                </TableRow>
              </TableHead>
            ) : null}
            <TableBody>
              {tickers.map(item => (
                <Ticker key={item.symbol} ticker={item} zoom={zoom.active} />
              ))}
            </TableBody>
          </ApolloDataTable>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
