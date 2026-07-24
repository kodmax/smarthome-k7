import { JobAdWithMeta } from '@repo/types'
import { FC, type ReactNode } from 'react'
import { AppliedDaysPrefix } from './AppliedDaysPrefix'
import { ApplyStatusIndicator } from './ApplyStatusIndicator'
import { JobFavIndicator } from './JobFavIndicator'
import { trailingGroupStyle } from './trailingGroupStyle'
import { WorkplaceTypeIndicator } from './WorkplaceTypeIndicator'

function hasAdTitleTrailingContent(ad: Pick<JobAdWithMeta, 'meta'>, zoom: boolean): boolean {
  if (zoom) {
    return true
  }

  return ad.meta.fav || ad.meta.application.status !== 'not-applied'
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
      <AppliedDaysPrefix application={ad.meta.application} />
      {children}
    </span>
  )
}
