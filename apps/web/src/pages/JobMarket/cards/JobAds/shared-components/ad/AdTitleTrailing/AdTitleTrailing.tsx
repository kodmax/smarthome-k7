import { JobAdWithMeta } from '@repo/types'
import { FC, type ReactNode } from 'react'
import { AppliedDaysPrefix } from './AppliedDaysPrefix'
import { ApplyStatusIndicator } from './ApplyStatusIndicator'
import { JobFavIndicator } from './JobFavIndicator'
import { MatchAnalysisIndicator } from './MatchAnalysisIndicator'
import { trailingGroupStyle } from './trailingGroupStyle'
import { WorkplaceTypeIndicator } from './WorkplaceTypeIndicator'

function hasAdTitleTrailingContent(ad: Pick<JobAdWithMeta, 'meta' | 'matchAnalysis'>, zoom: boolean): boolean {
  if (zoom) {
    return true
  }

  return ad.meta.fav || ad.meta.application.status !== 'not-applied' || ad.matchAnalysis !== null
}

export const AdTitleTrailing: FC<{
  ad: JobAdWithMeta
  zoom: boolean
  children?: ReactNode
}> = ({ ad, zoom, children }) => {
  if (!hasAdTitleTrailingContent(ad, zoom)) {
    return null
  }

  return (
    <span style={trailingGroupStyle}>
      {zoom ? <WorkplaceTypeIndicator workplaceType={ad.workplaceType} /> : null}
      <JobFavIndicator fav={ad.meta.fav} />
      <ApplyStatusIndicator ad={ad} />
      <MatchAnalysisIndicator matchAnalysis={ad.matchAnalysis} />
      <AppliedDaysPrefix application={ad.meta.application} />
      {children}
    </span>
  )
}
