import { TableBody } from '@mui/material'
import { useCallback, type FC } from 'react'
import { TrendUpIcon } from '@repo/assets'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import { ApolloDataTable, ApolloTableCell, ApolloTableRow, Graph, TablePlaceholder } from '@/card-components'
import { ApolloCard, ZoomContext } from '@repo/apollo-card'
import { FXFeed, FXRates } from '@repo/types'

const moreFx: Array<keyof FXRates> = ['EUR/PLN', 'USD/PLN', 'CHF/PLN', 'EUR/UAH', 'GBP/PLN', 'PLN/UAH', 'PLN/RUB']
const mainFx: Array<keyof FXRates> = ['EUR/PLN', 'USD/PLN', 'CHF/PLN', 'EUR/UAH']

export const FX: FC<Record<string, never>> = () => {
  const fx = useFeed<FXFeed>('fx')

  const onZoom = useCallback(() => {
    refreshFeeds(['fx'])
  }, [])

  return (
    <ApolloCard cardId='fx' title='Waluty' icon={TrendUpIcon} onZoom={onZoom}>
      <ZoomContext.Consumer>
        {zoom =>
          !fx ? (
            <TablePlaceholder rows={4} graph={true} value={true} />
          ) : (
            <ApolloDataTable>
              <TableBody>
                {(zoom.active ? moreFx : mainFx)
                  .filter(pair => pair in fx.rates)
                  .map(pair => {
                    return (
                      <ApolloTableRow key={pair}>
                        <ApolloTableCell>{pair}</ApolloTableCell>
                        <ApolloTableCell sx={{ padding: 0, width: '4em' }}>
                          <Graph scaleX={30} scaleY={+fx.rates[pair] / 10} data={fx.history[pair]} />
                        </ApolloTableCell>
                        {zoom.active ? (
                          <ApolloTableCell>
                            {Number(fx.rates[pair]).toFixed(2)} ({Number(1 / +fx.rates[pair]).toFixed(4)})
                          </ApolloTableCell>
                        ) : (
                          <ApolloTableCell>{Number(fx.rates[pair]).toFixed(2)}</ApolloTableCell>
                        )}
                      </ApolloTableRow>
                    )
                  })}
              </TableBody>
            </ApolloDataTable>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
