import { type FC } from 'react'
import ApolloCard, { ZoomContext } from '../../apollo-card/ApolloCard'
import { useUpdate } from '@repo/feed-client'
import banner from './job.jpg'
import TablePlaceholder from '../components/TablePlaceholder'
import { JobsData } from '@repo/types'
import { Ad } from './Ad'

export const Jobs: FC<Record<string, never>> = () => {
  const [jobs, updatedAt] = useUpdate<JobsData>('jobs')

  return (
    <ApolloCard cardId='jobs' banner={banner} updatedAt={updatedAt} height={6}>
      <ZoomContext.Consumer>
        {zoom =>
          !jobs ? (
            <TablePlaceholder rows={6} graph={true} value={true} />
          ) : (
            <>
              <table
                className='apollo-data-table'
                style={zoom.active ? { fontSize: '0.5em' } : { tableLayout: 'fixed', width: '100%' }}
              >
                <tbody>
                  {jobs.ads.map(ad => (
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
