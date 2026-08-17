import { JobAdsFeedItem } from '@repo/types'
import { FC } from 'react'
import { ApolloTableRow, LinkOpen } from '@/card-components'
import {
  AdSalaryCells,
  AdTitleText,
  AdTitleTrailing,
  JobTitleCell,
  JobTitleContent,
  PublishedTodayTag,
} from '@/pages/JobMarket/cards/JobAds/shared-components'

export const Ad: FC<{
  ad: JobAdsFeedItem
  zoom: boolean
  showSalary: boolean
}> = ({ ad, zoom, showSalary }) => {
  return (
    <ApolloTableRow>
      {zoom ? <LinkOpen href={ad.content.advertUrl} /> : null}
      <JobTitleCell>
        <JobTitleContent>
          <PublishedTodayTag publishedAt={ad.content.publishedAt} />
          <AdTitleText ad={ad} />
          <AdTitleTrailing ad={ad} zoom={zoom} />
        </JobTitleContent>
      </JobTitleCell>
      {showSalary ? <AdSalaryCells ad={ad} zoom={zoom} showHourlySalaryOnXs /> : null}
    </ApolloTableRow>
  )
}
