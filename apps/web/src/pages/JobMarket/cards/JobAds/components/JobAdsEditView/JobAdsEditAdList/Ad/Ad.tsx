import { JobAdsFeedItem } from '@repo/types'
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
import type { JobAdsChangeStatePayload } from '@repo/types'
import { AdExpandedEditorRow } from './AdExpandedEditorRow'
import { EditApplicationButton } from './EditApplicationButton'

export const Ad: FC<{
  ad: JobAdsFeedItem
  zoom: boolean
  editMode: boolean
  expanded: boolean
  onToggleExpand: (id: string) => void
  onChangeApplicationState: (payload: JobAdsChangeStatePayload) => void
  onFav: (id: string) => void
  onUnfav: (id: string) => void
  onAnalyzeCvMatch: (id: string) => void
  showApplyStatusIndicator?: boolean
}> = ({
  ad,
  zoom,
  editMode,
  expanded,
  onToggleExpand,
  onChangeApplicationState,
  onFav,
  onUnfav,
  onAnalyzeCvMatch,
  showApplyStatusIndicator = true,
}) => {
  const columnCount = zoom ? 4 : 2

  return (
    <Fragment>
      <ApolloTableRow>
        {zoom ? <LinkOpen href={ad.content.advertUrl} /> : null}
        <JobTitleCell>
          <JobTitleContent>
            <PublishedTodayTag publishedAt={ad.content.publishedAt} />
            <AdTitleText ad={ad} />
            <AdTitleTrailing ad={ad} zoom={zoom} showApplyStatusIndicator={showApplyStatusIndicator}>
              <EditApplicationButton
                visible={zoom && editMode}
                expanded={expanded}
                adId={ad.content.id}
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
          onSave={state => onChangeApplicationState({ id: ad.content.id, ...state })}
          onFav={onFav}
          onUnfav={onUnfav}
          onAnalyzeCvMatch={onAnalyzeCvMatch}
        />
      ) : null}
    </Fragment>
  )
}
