import { TableBody } from '@mui/material'
import { type FC, useCallback } from 'react'
import { ConsumptionIcon } from '@repo/assets'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import { ApolloCard, ZoomContext } from '@repo/apollo-card'
import { ApolloDataTable, ApolloTableCell, ApolloTableRow, Graph, TablePlaceholder } from '@/card-components'
import { CommoditiesFeed } from '@repo/types'

type Salaries = {
  median: number
  top20: number
}

type PriceRecord = {
  datetime: string
  amount: number
}

type History = {
  [k in keyof Salaries]: PriceRecord[]
}

interface JobsOffers {
  salaries: Salaries
  history: History
}

export const Commodities: FC<Record<string, never>> = () => {
  const commodities = useFeed<CommoditiesFeed>('commodities')
  const jobs = useFeed<JobsOffers>('jobs')

  const onZoom = useCallback(() => {
    refreshFeeds(['commodities'])
  }, [])

  if (commodities === undefined) {
    return (
      <ApolloCard cardId='commodities' title='Surowce' icon={ConsumptionIcon} height={4} onZoom={onZoom}>
        <TablePlaceholder rows={6} graph={true} value={true} />
      </ApolloCard>
    )
  }

  const inflationData = commodities.inflation.history
    .slice(-12)
    .map(({ datetime, value }) => ({ datetime, value, acc: 0 }))
  for (let i = 0, a = 1; i < inflationData.length; i++) {
    inflationData[i].acc = a *= inflationData[i].value / 100
  }

  return (
    <ApolloCard cardId='commodities' title='Surowce' icon={ConsumptionIcon} height={4}>
      <ZoomContext.Consumer>
        {zoom =>
          !commodities ? (
            <TablePlaceholder rows={6} graph={true} value={true} />
          ) : (
            <ApolloDataTable>
              <TableBody>
                <ApolloTableRow>
                  <ApolloTableCell>Inflacja</ApolloTableCell>
                  <ApolloTableCell sx={{ display: zoom.active ? 'initial' : 'none' }}>12 mscy</ApolloTableCell>
                  <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
                    <Graph scaleX={1 * 365} scaleY={0.05} data={inflationData} valueKey='acc' />
                  </ApolloTableCell>
                  <ApolloTableCell>
                    {inflationData.length > 0 ? Number(inflationData.slice(-1)[0].acc * 100 - 100).toFixed(1) : '--'} %
                  </ApolloTableCell>
                </ApolloTableRow>
                <ApolloTableRow>
                  <ApolloTableCell>Węgiel opałowy</ApolloTableCell>
                  <ApolloTableCell sx={{ display: zoom.active ? 'initial' : 'none' }}>30 dni</ApolloTableCell>
                  <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
                    <Graph
                      scaleX={30}
                      scaleY={commodities.coal['PLN/MT'] / 10}
                      data={commodities.coal.history}
                      valueKey='price'
                    />
                  </ApolloTableCell>
                  <ApolloTableCell>{`${commodities.coal['PLN/MT']} zł/t`}</ApolloTableCell>
                </ApolloTableRow>
                <ApolloTableRow>
                  <ApolloTableCell>Ropa naftowa</ApolloTableCell>
                  <ApolloTableCell sx={{ display: zoom.active ? 'initial' : 'none' }}>30 dni</ApolloTableCell>
                  <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
                    <Graph
                      scaleX={30}
                      scaleY={commodities.oil['PLN/l'] / 10}
                      data={commodities.oil.history}
                      valueKey='price'
                    />
                  </ApolloTableCell>
                  <ApolloTableCell>{`${commodities.oil['PLN/l']} zł/ℓ`}</ApolloTableCell>
                </ApolloTableRow>
                <ApolloTableRow>
                  <ApolloTableCell>Gaz ziemny</ApolloTableCell>
                  <ApolloTableCell sx={{ display: zoom.active ? 'initial' : 'none' }}>30 dni</ApolloTableCell>
                  <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
                    <Graph
                      scaleX={30}
                      scaleY={commodities.ng['PLN/GJ'] / 10}
                      data={commodities.ng.history}
                      valueKey='price'
                    />
                  </ApolloTableCell>
                  <ApolloTableCell>{`${commodities.ng['PLN/GJ']} zł/GJ`}</ApolloTableCell>
                </ApolloTableRow>
                <ApolloTableRow>
                  <ApolloTableCell>Złoto</ApolloTableCell>
                  <ApolloTableCell sx={{ display: zoom.active ? 'initial' : 'none' }}>30 dni</ApolloTableCell>
                  <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
                    <Graph
                      scaleX={30}
                      scaleY={Number(commodities.gold['PLN/g']) / 10}
                      data={commodities.gold.history}
                      valueKey='price'
                    />
                  </ApolloTableCell>
                  <ApolloTableCell>{`${commodities.gold['PLN/g']} zł/g`}</ApolloTableCell>
                </ApolloTableRow>
                {!jobs ? null : (
                  <ApolloTableRow>
                    <ApolloTableCell>Salaries</ApolloTableCell>
                    <ApolloTableCell sx={{ display: zoom.active ? 'initial' : 'none' }}>365 dni</ApolloTableCell>
                    <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
                      <Graph scaleX={365} scaleY={10000} data={jobs.history.top20} valueKey='amount' />
                    </ApolloTableCell>
                    <ApolloTableCell>{(jobs.salaries.top20 / 1000).toFixed(1)} kPLN</ApolloTableCell>
                  </ApolloTableRow>
                )}
              </TableBody>
            </ApolloDataTable>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
