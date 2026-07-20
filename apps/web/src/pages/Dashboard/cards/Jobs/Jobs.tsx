import { TableBody } from '@mui/material'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { JobsIcon, SettingsIcon } from '@repo/assets'
import { ApolloCard, ApolloCardAction, useZoom } from '@repo/apollo-card'
import { useCommand, useFeed } from '@repo/feed-client'
import { ApolloDataTable, TableEmptyMessage, TablePlaceholder } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { JobApplyStatus, JobsFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { Ad } from './Ad'
import { DEFAULT_JOB_ADS_FILTER, type JobAdsFilter } from './jobAdsFilter'
import { JobsFilterSelect } from './JobsFilterSelect'
import { getDisplayedJobAds } from './visibleJobAds'

const cardTableFontSize = designTokens.font.body.size

export const Jobs: FC<Record<string, never>> = () => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [adsFilter, setAdsFilter] = useState<JobAdsFilter>(DEFAULT_JOB_ADS_FILTER)
  const [expandedAdId, setExpandedAdId] = useState<string | null>(null)

  const zoom = useZoom('jobs')
  const feed = useFeed<JobsFeed>('jobs')
  const { t } = useTranslations()
  const labels = t.dashboard.jobs
  const changeState = useCommand('jobs', 'change-state')
  const fav = useCommand('jobs', 'fav')
  const unfav = useCommand('jobs', 'unfav')

  const onChangeApplicationState = useCallback(
    (id: string, applyStatus: JobApplyStatus, comment: string) => {
      changeState(JSON.stringify({ id, applyStatus, comment: comment || undefined }))
      setExpandedAdId(null)
    },
    [changeState],
  )

  const onFavJob = useCallback(
    (id: string) => {
      fav(id)
    },
    [fav],
  )

  const onUnfavJob = useCallback(
    (id: string) => {
      unfav(id)
    },
    [unfav],
  )

  const onToggleExpand = useCallback((id: string) => {
    setExpandedAdId(current => (current === id ? null : id))
  }, [])

  const onEditPreferences = useCallback(() => {
    setEditMode(current => !current)
  }, [])

  const onAdsFilterChange = useCallback((filter: JobAdsFilter) => {
    setAdsFilter(filter)
  }, [])

  useEffect(() => {
    if (!zoom) {
      setEditMode(false)
      setAdsFilter(DEFAULT_JOB_ADS_FILTER)
      setExpandedAdId(null)
    }
  }, [zoom])

  useEffect(() => {
    if (!editMode) {
      setAdsFilter(DEFAULT_JOB_ADS_FILTER)
      setExpandedAdId(null)
    }
  }, [editMode])

  const ads = useMemo(
    () => getDisplayedJobAds(feed?.ads, { editMode, filter: adsFilter }),
    [adsFilter, editMode, feed?.ads],
  )

  return (
    <ApolloCard
      cardId='jobs'
      title={labels.title}
      icon={JobsIcon}
      height={6}
      headingInfo={ads.length}
      actions={
        <>
          {editMode ? <JobsFilterSelect value={adsFilter} onChange={onAdsFilterChange} /> : null}
          <ApolloCardAction
            title={t.dashboard.common.editPreferences}
            onClick={onEditPreferences}
            Icon={SettingsIcon}
          />
        </>
      }
    >
      {!feed ? (
        <TablePlaceholder rows={12} graph={true} value={true} />
      ) : ads.length === 0 ? (
        <TableEmptyMessage>{t.dashboard.common.emptyMessage}</TableEmptyMessage>
      ) : (
        <ApolloDataTable style={{ fontSize: cardTableFontSize, tableLayout: 'fixed', width: '100%' }}>
          <TableBody>
            {ads.map(ad => (
              <Ad
                key={ad.id}
                ad={ad}
                zoom={zoom}
                editMode={editMode}
                expanded={expandedAdId === ad.id}
                onToggleExpand={onToggleExpand}
                onChangeApplicationState={onChangeApplicationState}
                onFav={onFavJob}
                onUnfav={onUnfavJob}
              />
            ))}
          </TableBody>
        </ApolloDataTable>
      )}
    </ApolloCard>
  )
}

export default Jobs
