import { JobAdWithMeta, JobApplyStatus } from '@repo/types'
import { FC, Fragment } from 'react'
import { ApolloTableRow, LinkOpen } from '@/card-components'
import { AdExpandedEditorRow } from './AdExpandedEditorRow'
import { AdSalaryCells } from './AdSalaryCells'
import { AdTitleText } from './AdTitleText'
import { AdTitleTrailing } from './AdTitleTrailing'
import { JobTitleCell, JobTitleContent } from './styled'

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
            <AdTitleText ad={ad} />
            <AdTitleTrailing
              ad={ad}
              editMode={editMode}
              zoom={zoom}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
            />
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
