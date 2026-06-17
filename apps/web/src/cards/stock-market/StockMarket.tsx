import zoomBanner from './stock-market-zoom.webp'
import banner from './stock-market.webp'
import { type FC, useMemo } from 'react'
import { useFeed } from '@repo/feed-client'
import ApolloCard, { ZoomContext } from '../../apollo-card/ApolloCard'
import TablePlaceholder from '../components/TablePlaceholder'
import { StockMarketFeed } from '@repo/types'
import { Ticker } from './Ticker'
import { TickerDetails } from './types'
import { TableBody, TableHead } from '@mui/material'
import { Header } from './Ticker/styled'

export const StockMarket: FC<Record<string, never>> = () => {
  const feed = useFeed<StockMarketFeed>('stock-market')

  const tickers = useMemo<TickerDetails[] | undefined>(
    () =>
      feed !== undefined
        ? feed.tickers
            .map((data): TickerDetails => {
              const eg = (data.price.oneYearTarget / data.price.lastTradePrice - 1) * 100
              return {
                eg,
                data,
              }
            })
            .sort((a, b) => +b.eg - +a.eg)
        : undefined,
    [feed],
  )

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
          <table className='apollo-data-table' style={zoom.active ? { fontSize: '0.8em', lineHeight: 1.2 } : undefined}>
            {zoom.active ? (
              <TableHead>
                <Header>Ticker</Header>
                <Header>Market Cap.</Header>
                <Header>Earnings Date</Header>
                <Header>PE</Header>
                <Header>EG</Header>
                <Header></Header>
                <Header>Price</Header>
              </TableHead>
            ) : null}
            <TableBody>
              {tickers.map(item => (
                <Ticker key={item.data.ticker} item={item} zoom={zoom.active} />
              ))}
            </TableBody>
          </table>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
