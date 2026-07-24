import { type FC, useCallback, useState } from 'react'
import { JobsIcon } from '@repo/assets'
import { BaseCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { JobsFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { DEFAULT_JOB_ADS_FILTER, type JobAdsFilter } from './jobAdsFilter'
import { countJobsEditViewAds, JobsEditView } from './components/JobsEditView'
import { JobsFilterSelect } from './components/JobsFilterSelect'
import { AcceptableSalarySlider } from './components/AcceptableSalarySlider'

export const Jobs: FC<Record<string, never>> = () => {
  const [adsFilter, setAdsFilter] = useState<JobAdsFilter>(DEFAULT_JOB_ADS_FILTER)

  const feed = useFeed<JobsFeed>('jobs')
  const { t } = useTranslations()
  const labels = t.dashboard.jobs

  const onAdsFilterChange = useCallback((filter: JobAdsFilter) => {
    setAdsFilter(filter)
  }, [])

  if (feed === undefined) {
    return (
      <BaseCard cardId='jobs' title={labels.title} icon={JobsIcon} height={14} extraHeight={4} allowZoom={false}>
        {null}
      </BaseCard>
    )
  }

  return (
    <BaseCard
      cardId='jobs'
      title={labels.title}
      icon={JobsIcon}
      height={14}
      extraHeight={4}
      allowZoom={false}
      headingInfo={countJobsEditViewAds(feed.ads, adsFilter)}
      actions={
        <>
          <AcceptableSalarySlider salaryRange={feed.salaryRange} acceptableSalary={feed.acceptableSalary} />
          <JobsFilterSelect value={adsFilter} onChange={onAdsFilterChange} />
        </>
      }
    >
      <JobsEditView ads={feed.ads} zoom={true} filter={adsFilter} />
    </BaseCard>
  )
}

export default Jobs
