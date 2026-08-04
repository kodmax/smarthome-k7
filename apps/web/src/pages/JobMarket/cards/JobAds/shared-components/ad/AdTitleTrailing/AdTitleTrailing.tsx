import { isJobAdApplied, JobAdsFeedItem } from '@repo/types'
import { FC, type ReactNode } from 'react'
import { ApplyStatusIndicator } from './ApplyStatusIndicator'
import { AppliedIndicator } from './AppliedIndicator'
import { JobFavIndicator } from './JobFavIndicator'
import { MatchAnalysisIndicator } from './MatchAnalysisIndicator'
import { trailingGroupStyle } from './trailingGroupStyle'
import { WorkplaceTypeIndicator } from './WorkplaceTypeIndicator'

function hasAdTitleTrailingContent(
  ad: Pick<JobAdsFeedItem, 'meta' | 'matchAnalysis'>,
  zoom: boolean,
  showApplyStatusIndicator: boolean,
): boolean {
  if (zoom) {
    return true
  }

  const showsStatusIndicator = showApplyStatusIndicator && ad.meta.application.status !== 'pending-review'

  return ad.meta.fav || showsStatusIndicator || isJobAdApplied(ad) || ad.matchAnalysis !== null
}

export const AdTitleTrailing: FC<{
  ad: JobAdsFeedItem
  zoom: boolean
  showApplyStatusIndicator?: boolean
  children?: ReactNode
}> = ({ ad, zoom, showApplyStatusIndicator = true, children }) => {
  if (!hasAdTitleTrailingContent(ad, zoom, showApplyStatusIndicator)) {
    return null
  }

  return (
    <span style={trailingGroupStyle}>
      {zoom ? <WorkplaceTypeIndicator workplaceType={ad.content.workplaceType} /> : null}
      <JobFavIndicator fav={ad.meta.fav} />
      <AppliedIndicator ad={ad} />
      {showApplyStatusIndicator ? <ApplyStatusIndicator ad={ad} /> : null}
      <MatchAnalysisIndicator ad={ad} />
      {children}
    </span>
  )
}
