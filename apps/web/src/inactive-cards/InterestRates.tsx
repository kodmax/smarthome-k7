import { TableBody } from '@mui/material'
import { ApolloCard } from '@repo/apollo-card'
import { TrendUpIcon } from '@repo/assets'
import { ApolloDataTable, ApolloTableCell, ApolloTableRow, Graph, TablePlaceholder } from '@/card-components'
import { useFeed } from '@repo/feed-client'
import { type FC } from 'react'
import { InterestRatesFeed } from '@repo/types'

export const Wibor: FC<Record<string, never>> = () => {
  const feed = useFeed<InterestRatesFeed>('irs')

  if (feed === undefined) {
    return (
      <ApolloCard cardId='interest-rates' title='Stopy procentowe' icon={TrendUpIcon}>
        <TablePlaceholder rows={4} graph={true} value={true} />
      </ApolloCard>
    )
  }

  return (
    <ApolloCard cardId='interest-rates' title='Stopy procentowe' icon={TrendUpIcon}>
      <ApolloDataTable>
        <TableBody>
          <ApolloTableRow>
            <ApolloTableCell>Stopa ref.</ApolloTableCell>
            <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
              <Graph data={feed['NBP Ref.'].history} scaleX={30} scaleY={1} valueKey='rate' />
            </ApolloTableCell>
            <ApolloTableCell>{feed['NBP Ref.'].current} %</ApolloTableCell>
          </ApolloTableRow>
          <ApolloTableRow>
            <ApolloTableCell>Wibor 1M</ApolloTableCell>
            <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
              <Graph data={feed['WIBOR 1M'].history} scaleX={30} scaleY={1} valueKey='rate' />
            </ApolloTableCell>
            <ApolloTableCell>{feed['WIBOR 1M'].current} %</ApolloTableCell>
          </ApolloTableRow>
          <ApolloTableRow>
            <ApolloTableCell>Wibor 3M</ApolloTableCell>
            <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
              <Graph data={feed['WIBOR 3M'].history} scaleX={30} scaleY={1} valueKey='rate' />
            </ApolloTableCell>
            <ApolloTableCell>{feed['WIBOR 3M'].current} %</ApolloTableCell>
          </ApolloTableRow>
          <ApolloTableRow>
            <ApolloTableCell>Wibor 6M</ApolloTableCell>
            <ApolloTableCell sx={{ width: '4em', padding: 0 }}>
              <Graph data={feed['WIBOR 6M'].history} scaleX={30} scaleY={1} valueKey='rate' />
            </ApolloTableCell>
            <ApolloTableCell>{feed['WIBOR 6M'].current} %</ApolloTableCell>
          </ApolloTableRow>
        </TableBody>
      </ApolloDataTable>
    </ApolloCard>
  )
}
