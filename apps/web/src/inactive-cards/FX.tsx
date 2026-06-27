import { useCallback, type FC } from 'react'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import banner from '../cards/card-banners/fx.jpg'
import { Graph } from '../cards/components/Graph'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import TablePlaceholder from '../cards/components/TablePlaceholder'
import { FXFeed, FXRates } from '@repo/types'

const moreFx: Array<keyof FXRates> = ['EUR/PLN', 'USD/PLN', 'CHF/PLN', 'EUR/UAH', 'GBP/PLN', 'PLN/UAH', 'PLN/RUB']
const mainFx: Array<keyof FXRates> = ['EUR/PLN', 'USD/PLN', 'CHF/PLN', 'EUR/UAH']

export const FX: FC<Record<string, never>> = () => {
  const fx = useFeed<FXFeed>('fx')

  const onZoom = useCallback(() => {
    refreshFeeds(['fx'])
  }, [])

  return (
    <ApolloCard cardId='fx' banner={banner} onZoom={onZoom}>
      <ZoomContext.Consumer>
        {zoom =>
          !fx ? (
            <TablePlaceholder rows={4} graph={true} value={true} />
          ) : (
            <table className='apollo-data-table'>
              <tbody>
                {(zoom.active ? moreFx : mainFx)
                  .filter(pair => pair in fx.rates)
                  .map(pair => {
                    return (
                      <tr key={pair}>
                        <td>{pair}</td>
                        <td style={{ padding: 0, width: '4em' }}>
                          <Graph scaleX={30} scaleY={+fx.rates[pair] / 10} data={fx.history[pair]} />
                        </td>
                        {zoom.active ? (
                          <td>
                            {Number(fx.rates[pair]).toFixed(2)} ({Number(1 / +fx.rates[pair]).toFixed(4)})
                          </td>
                        ) : (
                          <td>{Number(fx.rates[pair]).toFixed(2)}</td>
                        )}
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
