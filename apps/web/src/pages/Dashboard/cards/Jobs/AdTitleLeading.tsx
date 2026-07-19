import { JobAdWithMeta } from '@repo/types'
import { FC } from 'react'
import { AppliedDaysPrefix } from './AppliedDaysPrefix'
import { ApplyStatusIndicator } from './ApplyStatusIndicator'
import { EditApplicationButton } from './EditApplicationButton'
import { JobFavIndicator } from './JobFavIndicator'
import { jobTitleLeadingGroupStyle } from './jobTitleIcons'

function hasAdTitleLeadingContent(ad: Pick<JobAdWithMeta, 'meta'>, editMode: boolean, zoom: boolean): boolean {
  return ad.meta.fav || ad.meta.application.status !== 'not-applied' || (zoom && editMode)
}

export const AdTitleLeading: FC<{
  ad: Pick<JobAdWithMeta, 'id' | 'meta'>
  editMode: boolean
  zoom: boolean
  expanded: boolean
  onToggleExpand: (id: string) => void
}> = ({ ad, editMode, zoom, expanded, onToggleExpand }) => {
  if (!hasAdTitleLeadingContent(ad, editMode, zoom)) {
    return null
  }

  return (
    <span style={jobTitleLeadingGroupStyle}>
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
