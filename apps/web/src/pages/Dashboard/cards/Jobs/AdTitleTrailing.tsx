import { JobAdWithMeta } from '@repo/types'
import { FC } from 'react'
import { AppliedDaysPrefix } from './AppliedDaysPrefix'
import { ApplyStatusIndicator } from './ApplyStatusIndicator'
import { EditApplicationButton } from './EditApplicationButton'
import { JobFavIndicator } from './JobFavIndicator'
import { WorkplaceTypeIndicator } from './WorkplaceTypeIndicator'
import { jobTitleTrailingGroupStyle } from './jobTitleIcons'

function hasAdTitleTrailingContent(ad: Pick<JobAdWithMeta, 'meta'>, zoom: boolean): boolean {
  if (zoom) {
    return true
  }

  return ad.meta.fav || ad.meta.application.status !== 'not-applied'
}

export const AdTitleTrailing: FC<{
  ad: JobAdWithMeta
  editMode: boolean
  zoom: boolean
  expanded: boolean
  onToggleExpand: (id: string) => void
}> = ({ ad, editMode, zoom, expanded, onToggleExpand }) => {
  if (!hasAdTitleTrailingContent(ad, zoom)) {
    return null
  }

  return (
    <span style={jobTitleTrailingGroupStyle}>
      {zoom ? <WorkplaceTypeIndicator workplaceType={ad.workplaceType} /> : null}
      <JobFavIndicator fav={ad.meta.fav} />
      <ApplyStatusIndicator ad={ad} />
      <AppliedDaysPrefix editMode={editMode} application={ad.meta.application} />
      <EditApplicationButton
        visible={zoom && editMode}
        expanded={expanded}
        adId={ad.id}
        onToggleExpand={onToggleExpand}
      />
    </span>
  )
}
