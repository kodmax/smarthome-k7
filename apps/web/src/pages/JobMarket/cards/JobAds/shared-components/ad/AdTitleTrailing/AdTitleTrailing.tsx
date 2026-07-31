import { isJobAdApplied, JobAdsFeedItem } from '@repo/types'
import { FC, type ReactNode } from 'react'
import { ApplyStatusIndicator } from './ApplyStatusIndicator'
import { AppliedIndicator } from './AppliedIndicator'
import { JobFavIndicator } from './JobFavIndicator'
import { MatchAnalysisIndicator } from './MatchAnalysisIndicator'
import { trailingGroupStyle } from './trailingGroupStyle'
import { WorkplaceTypeIndicator } from './WorkplaceTypeIndicator'

function hasAdTitleTrailingContent(ad: Pick<JobAdsFeedItem, 'meta' | 'matchAnalysis'>, zoom: boolean): boolean {
  if (zoom) {
    return true
  }

  return ad.meta.fav || ad.meta.application.status !== 'not-applied' || isJobAdApplied(ad) || ad.matchAnalysis !== null
}

export const AdTitleTrailing: FC<{
  ad: JobAdsFeedItem
  zoom: boolean
  children?: ReactNode
}> = ({ ad, zoom, children }) => {
  if (!hasAdTitleTrailingContent(ad, zoom)) {
    return null
  }

  return (
    <span style={trailingGroupStyle}>
      {zoom ? <WorkplaceTypeIndicator workplaceType={ad.content.workplaceType} /> : null}
      <JobFavIndicator fav={ad.meta.fav} />
      <AppliedIndicator ad={ad} />
      <ApplyStatusIndicator ad={ad} />
      <MatchAnalysisIndicator ad={ad} />
      {children}
    </span>
  )
}
