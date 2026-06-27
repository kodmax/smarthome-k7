import banner from '../cards/card-banners/interest-rates.jpg'
import { ApolloCard } from '@/apollo-card'
import { Graph } from '../cards/components/Graph'
import TablePlaceholder from '../cards/components/TablePlaceholder'
import { useFeed } from '@repo/feed-client'
import { type FC } from 'react'
import { InterestRatesFeed } from '@repo/types'

export const Wibor: FC<Record<string, never>> = () => {
  const feed = useFeed<InterestRatesFeed>('irs')

  if (feed === undefined) {
    return (
      <ApolloCard cardId='interest-rates' banner={banner}>
        <TablePlaceholder rows={4} graph={true} value={true} />
      </ApolloCard>
    )
  }

  return (
    <ApolloCard cardId='interest-rates' banner={banner}>
      <table className='apollo-data-table'>
        <tbody>
          <tr>
            <td>Stopa ref.</td>
            <td style={{ width: '4em', padding: 0 }}>
              <Graph data={feed['NBP Ref.'].history} scaleX={30} scaleY={1} valueKey='rate' />
            </td>
            <td>{feed['NBP Ref.'].current} %</td>
          </tr>
          <tr>
            <td>Wibor 1M</td>
            <td style={{ width: '4em', padding: 0 }}>
              <Graph data={feed['WIBOR 1M'].history} scaleX={30} scaleY={1} valueKey='rate' />
            </td>
            <td>{feed['WIBOR 1M'].current} %</td>
          </tr>
          <tr>
            <td>Wibor 3M</td>
            <td style={{ width: '4em', padding: 0 }}>
              <Graph data={feed['WIBOR 3M'].history} scaleX={30} scaleY={1} valueKey='rate' />
            </td>
            <td>{feed['WIBOR 3M'].current} %</td>
          </tr>
          <tr>
            <td>Wibor 6M</td>
            <td style={{ width: '4em', padding: 0 }}>
              <Graph data={feed['WIBOR 6M'].history} scaleX={30} scaleY={1} valueKey='rate' />
            </td>
            <td>{feed['WIBOR 6M'].current} %</td>
          </tr>
        </tbody>
      </table>
    </ApolloCard>
  )
}
