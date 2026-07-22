import { JobAdWithMeta } from '@repo/types'
import { FC } from 'react'
import { ApolloTableRow, LinkOpen } from '@/card-components'
import {
  AdSalaryCells,
  AdTitleText,
  AdTitleTrailing,
  JobTitleCell,
  JobTitleContent,
  PublishedTodayTag,
} from '@/pages/JobMarket/cards/Jobs/shared-components'

export const Ad: FC<{
  ad: JobAdWithMeta
  zoom: boolean
}> = ({ ad, zoom }) => {
  return (
    <ApolloTableRow>
      {zoom ? <LinkOpen href={ad.advertUrl} /> : null}
      <JobTitleCell>
        <JobTitleContent>
          <PublishedTodayTag publishedAt={ad.publishedAt} />
          <AdTitleText ad={ad} />
          <AdTitleTrailing ad={ad} zoom={zoom} />
        </JobTitleContent>
      </JobTitleCell>
      <AdSalaryCells ad={ad} zoom={zoom} />
    </ApolloTableRow>
  )
}
