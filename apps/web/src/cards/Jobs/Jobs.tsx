import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { JobsIcon } from '@repo/assets'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { useFeed } from '@repo/feed-client'
import { ApolloDataTable, TablePlaceholder } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { JobsFeed } from '@repo/types'
import { Ad } from './Ad'

const cardTableFontSize = designTokens.font.body.size

export const Jobs: FC<Record<string, never>> = () => {
  const feed = useFeed<JobsFeed>('jobs')

  return (
    <ApolloCard cardId='jobs' title='Oferty pracy' icon={JobsIcon} height={9}>
      <ZoomContext.Consumer>
        {zoom =>
          !feed ? (
            <TablePlaceholder rows={12} graph={true} value={true} />
          ) : (
            <>
              <ApolloDataTable style={{ fontSize: cardTableFontSize, tableLayout: 'fixed', width: '100%' }}>
                <TableBody>
                  {feed.ads.map(ad => (
                    <Ad key={ad.id} ad={ad} zoom={zoom.active} />
                  ))}
                </TableBody>
              </ApolloDataTable>
            </>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}

export default Jobs
