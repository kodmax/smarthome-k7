import { JobAdWithMeta, JobApplyStatus } from '@repo/types'
import { FC, Fragment } from 'react'
import { ApolloTableRow, LinkOpen } from '@/card-components'
import {
  AdSalaryCells,
  AdTitleText,
  AdTitleTrailing,
  JobTitleCell,
  JobTitleContent,
  PublishedTodayTag,
} from '../../../../shared-components'
import { AdExpandedEditorRow } from './AdExpandedEditorRow'
import { EditApplicationButton } from './EditApplicationButton'

export const Ad: FC<{
  ad: JobAdWithMeta
  zoom: boolean
  editMode: boolean
  expanded: boolean
  onToggleExpand: (id: string) => void
  onChangeApplicationState: (id: string, applyStatus: JobApplyStatus, comment: string) => void
  onFav: (id: string) => void
  onUnfav: (id: string) => void
}> = ({ ad, zoom, editMode, expanded, onToggleExpand, onChangeApplicationState, onFav, onUnfav }) => {
  const columnCount = zoom ? 4 : 2

  return (
    <Fragment>
      <ApolloTableRow>
        {zoom ? <LinkOpen href={ad.advertUrl} /> : null}
        <JobTitleCell>
          <JobTitleContent>
            <PublishedTodayTag publishedAt={ad.publishedAt} />
            <AdTitleText ad={ad} />
            <AdTitleTrailing ad={ad} zoom={zoom}>
              <EditApplicationButton
                visible={zoom && editMode}
                expanded={expanded}
                adId={ad.id}
                onToggleExpand={onToggleExpand}
              />
            </AdTitleTrailing>
          </JobTitleContent>
        </JobTitleCell>
        <AdSalaryCells ad={ad} zoom={zoom} />
      </ApolloTableRow>
      {zoom && editMode && expanded ? (
        <AdExpandedEditorRow
          ad={ad}
          columnCount={columnCount}
          onSave={(applyStatus, comment) => onChangeApplicationState(ad.id, applyStatus, comment)}
          onFav={onFav}
          onUnfav={onUnfav}
        />
      ) : null}
    </Fragment>
  )
}
