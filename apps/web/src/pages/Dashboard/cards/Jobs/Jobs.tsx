import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { JobsIcon, SettingsIcon } from '@repo/assets'
import { BaseCard, ApolloCardAction, useZoom } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { TablePlaceholder } from '@/card-components'
import { JobsFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { DEFAULT_JOB_ADS_FILTER, type JobAdsFilter } from './jobAdsFilter'
import { countJobsEditViewAds, JobsEditView } from './JobsEditView'
import { JobsFilterSelect } from './JobsFilterSelect'
import { countJobsReadingViewAds, JobsReadingView } from './JobsReadingView'

export const Jobs: FC<Record<string, never>> = () => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [adsFilter, setAdsFilter] = useState<JobAdsFilter>(DEFAULT_JOB_ADS_FILTER)

  const zoom = useZoom('jobs')
  const feed = useFeed<JobsFeed>('jobs')
  const { t } = useTranslations()
  const labels = t.dashboard.jobs

  const onEditPreferences = useCallback(() => {
    setEditMode(current => !current)
  }, [])

  const onAdsFilterChange = useCallback((filter: JobAdsFilter) => {
    setAdsFilter(filter)
  }, [])

  useEffect(() => {
    if (!zoom) {
      setEditMode(false)
    }
  }, [zoom])

  useEffect(() => {
    if (!editMode) {
      setAdsFilter(DEFAULT_JOB_ADS_FILTER)
    }
  }, [editMode])

  const headingInfo = useMemo(() => {
    if (!feed) {
      return undefined
    }

    return editMode ? countJobsEditViewAds(feed.ads, adsFilter) : countJobsReadingViewAds(feed.ads)
  }, [adsFilter, editMode, feed])

  return (
    <BaseCard
      cardId='jobs'
      title={labels.title}
      icon={JobsIcon}
      height={6}
      headingInfo={headingInfo}
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
      ) : editMode ? (
        <JobsEditView ads={feed.ads} zoom={zoom} filter={adsFilter} />
      ) : (
        <JobsReadingView ads={feed.ads} zoom={zoom} />
      )}
    </BaseCard>
  )
}

export default Jobs
