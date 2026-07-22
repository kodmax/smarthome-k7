import { JobAdWithMeta, JobApplyStatus } from '@repo/types'
import { FC, Fragment } from 'react'
import { ApolloTableRow, LinkOpen, Tag } from '@/card-components'
import { useTranslations } from '@/i18n'
import { AdExpandedEditorRow } from './AdExpandedEditorRow'
import { AdSalaryCells } from './AdSalaryCells'
import { AdTitleText } from './AdTitleText'
import { AdTitleTrailing } from './AdTitleTrailing'
import { isPublishedToday } from './formatAppliedDaysAgo'
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
  const { t } = useTranslations()
  const columnCount = zoom ? 4 : 2

  return (
    <Fragment>
      <ApolloTableRow>
        {zoom ? <LinkOpen href={ad.advertUrl} /> : null}
        <JobTitleCell>
          <JobTitleContent>
            {isPublishedToday(ad.publishedAt) ? <Tag variant='new'>{t.dashboard.jobs.publishedTodayTag}</Tag> : null}
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
