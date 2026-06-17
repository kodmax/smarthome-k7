import { type FC } from 'react'
import ApolloCard, { ZoomContext } from '../../apollo-card/ApolloCard'
import { useFeed } from '@repo/feed-client'
import banner from './job.jpg'
import TablePlaceholder from '../components/TablePlaceholder'
import { JobsFeed } from '@repo/types'
import { Ad } from './Ad'

export const Jobs: FC<Record<string, never>> = () => {
  const feed = useFeed<JobsFeed>('jobs')

  return (
    <ApolloCard cardId='jobs' banner={banner} height={10}>
      <ZoomContext.Consumer>
        {zoom =>
          !feed ? (
            <TablePlaceholder rows={12} graph={true} value={true} />
          ) : (
            <>
              <table
                className='apollo-data-table'
                style={zoom.active ? { fontSize: '0.5em' } : { tableLayout: 'fixed', width: '100%' }}
              >
                <tbody>
                  {feed.ads.map(ad => (
                    <tr key={ad.id}>
                      <Ad ad={ad} zoom={zoom.active} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}

export default Jobs
