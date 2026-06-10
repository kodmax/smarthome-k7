import zoomBanner from './card-banners/commodities-zoom.jpg'
import banner from './card-banners/commodities.jpg'
import { type FC, useCallback, useMemo } from 'react'
import { refreshFeeds, useUpdate } from '@repo/feed-client'
import ApolloCard, { ZoomContext } from '../apollo-card/ApolloCard'
import TablePlaceholder from './components/TablePlaceholder'
import { StockMarketData } from '@repo/types'

export const StockMarket: FC<Record<string, never>> = () => {
  const [data, updatedAt] = useUpdate<StockMarketData>('stock-market')

  const onZoom = useCallback(() => {
    refreshFeeds(['stock-market'])
  }, [])

  const tickers = useMemo(
    () =>
      data !== undefined
        ? data.tickers.filter(item => +item.daily.eps > 0).sort((a, b) => +b.daily.eg - +a.daily.eg)
        : undefined,
    [data],
  )

  if (data === undefined || tickers === undefined) {
    return (
      <ApolloCard
        cardId='stock-market'
        banner={banner}
        zoomBanner={zoomBanner}
        updatedAt={updatedAt}
        height={6}
        onZoom={onZoom}
      >
        <TablePlaceholder rows={6} graph={false} value={true} />
      </ApolloCard>
    )
  }

  return (
    <ApolloCard cardId='stock-market' banner={banner} zoomBanner={zoomBanner} updatedAt={updatedAt} height={6}>
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
                <tr>
                  <td>{item.ticker}</td>
                  <td style={{ width: '2em' }}>{item.daily.pe !== undefined ? Math.round(+item.daily.pe) : '-'}</td>
                  {zoom.active ? (
                    <>
                      <td style={{ width: '2em' }}>{item.daily.eg}%</td>
                    </>
                  ) : null}
                  <td style={{ width: '4em' }}>{item.daily.priceAtClose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
