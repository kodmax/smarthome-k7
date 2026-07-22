import { type FC, useCallback, useMemo, useState } from 'react'
import { JobsIcon } from '@repo/assets'
import { BaseCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { TablePlaceholder } from '@/card-components'
import { JobsFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { DEFAULT_JOB_ADS_FILTER, type JobAdsFilter } from './jobAdsFilter'
import { countJobsEditViewAds, JobsEditView } from './components/JobsEditView'
import { JobsFilterSelect } from './components/JobsFilterSelect'

export const Jobs: FC<Record<string, never>> = () => {
  const [adsFilter, setAdsFilter] = useState<JobAdsFilter>(DEFAULT_JOB_ADS_FILTER)

  const feed = useFeed<JobsFeed>('jobs')
  const { t } = useTranslations()
  const labels = t.dashboard.jobs

  const onAdsFilterChange = useCallback((filter: JobAdsFilter) => {
    setAdsFilter(filter)
  }, [])

  const headingInfo = useMemo(() => {
    if (!feed) {
      return undefined
    }

    return countJobsEditViewAds(feed.ads, adsFilter)
  }, [adsFilter, feed])

  return (
    <BaseCard
      cardId='jobs'
      title={labels.title}
      icon={JobsIcon}
      height={6}
      allowZoom={false}
      headingInfo={headingInfo}
      actions={<JobsFilterSelect value={adsFilter} onChange={onAdsFilterChange} />}
    >
      {!feed ? (
        <TablePlaceholder rows={12} graph={true} value={true} />
      ) : (
        <JobsEditView ads={feed.ads} zoom={true} filter={adsFilter} />
      )}
    </BaseCard>
  )
}

export default Jobs
