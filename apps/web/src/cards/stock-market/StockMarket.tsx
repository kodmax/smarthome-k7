import zoomBanner from './stock-market-zoom.webp'
import banner from './stock-market.webp'
import { type FC } from 'react'
import { useFeed } from '@repo/feed-client'
import ApolloCard, { ZoomContext } from '../../apollo-card/ApolloCard'
import TablePlaceholder from '../components/TablePlaceholder'
import { StockMarketFeed } from '@repo/types'
import { Ticker } from './Ticker'
import { TableBody, TableHead, TableRow } from '@mui/material'
import { Header } from './Ticker/styled'
import { useSortedTickers } from './useSortedTickers'

export const StockMarket: FC<Record<string, never>> = () => {
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed)

  if (feed === undefined || tickers === undefined) {
    return (
      <ApolloCard cardId='stock-market' banner={banner} zoomBanner={zoomBanner} height={10}>
        <TablePlaceholder rows={12} graph={false} value={true} />
      </ApolloCard>
    )
  }

  return (
    <ApolloCard cardId='stock-market' banner={banner} zoomBanner={zoomBanner} height={10}>
      <ZoomContext.Consumer>
        {zoom => (
          <table className='apollo-data-table' style={zoom.active ? { fontSize: '0.6em', lineHeight: 1.2 } : undefined}>
            {zoom.active ? (
              <TableHead>
                <TableRow>
                  <Header>Ticker</Header>
                  <Header>Earnings Date</Header>
                  <Header>EG</Header>
                  <Header>PE@PT</Header>
                  <Header sx={{ textAlign: 'center' }}>Price</Header>
                </TableRow>
              </TableHead>
            ) : null}
            <TableBody>
              {tickers.map(item => (
                <Ticker key={item.symbol} ticker={item} />
              ))}
            </TableBody>
          </table>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
