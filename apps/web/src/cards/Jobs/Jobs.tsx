import { type FC } from 'react'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { useFeed } from '@repo/feed-client'
import banner from './job.jpg'
import { ApolloDataTable, TablePlaceholder } from '@/card-components'
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
              <ApolloDataTable style={zoom.active ? { fontSize: '0.5em' } : { tableLayout: 'fixed', width: '100%' }}>
                <tbody>
                  {feed.ads.map(ad => (
                    <Ad key={ad.id} ad={ad} zoom={zoom.active} />
                  ))}
                </tbody>
              </ApolloDataTable>
            </>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}

export default Jobs
