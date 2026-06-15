import zoomBanner from './commodities-zoom.jpg'
import banner from './commodities.jpg'
import { type FC, useMemo } from 'react'
import { useFeed } from '@repo/feed-client'
import ApolloCard, { ZoomContext } from '../../apollo-card/ApolloCard'
import TablePlaceholder from '../components/TablePlaceholder'
import { StockMarketFeed } from '@repo/types'
import { Ticker } from './Ticker'
import { TickerDetails } from './types'

export const StockMarket: FC<Record<string, never>> = () => {
  const feed = useFeed<StockMarketFeed>('stock-market')

  const tickers = useMemo<TickerDetails[] | undefined>(
    () =>
      feed !== undefined
        ? feed.tickers
            .map((data): TickerDetails => {
              const price = data.lastTradePrice

              const eg = (+data.priceTarget / +data.lastTradePrice - 1) * 100
              return {
                price,
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
          <table className='apollo-data-table'>
            {zoom.active ? (
              <thead>
                <th>Ticker</th>
                <th>PE</th>
                <th>EG</th>
                <th>Price</th>
              </thead>
            ) : null}
            <tbody>
              {tickers.map(item => (
                <Ticker key={item.data.ticker} item={item} zoom={zoom.active} />
              ))}
            </tbody>
          </table>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
