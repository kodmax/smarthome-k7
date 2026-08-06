import { type FC, useCallback, useState } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { JobAdsIcon, PlusIcon } from '@repo/assets'
import { ApolloCardAction, BaseCard } from '@repo/apollo-card'
import { useCommand, useFeed } from '@repo/feed-client'
import { JobAdsFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { DEFAULT_JOB_ADS_FILTER, type JobAdsFilter } from './jobAdsFilter'
import { countJobAdsEditViewAds, JobAdsEditView } from './components/JobAdsEditView'
import { JobAdsFilterSelect } from './components/JobAdsFilterSelect'
import { AcceptableSalarySlider } from './components/AcceptableSalarySlider'
import { AddManualJobAdDialog, type AddManualJobAdPayload } from './components/AddManualJobAdDialog'

export const JobAds: FC<Record<string, never>> = () => {
  const [adsFilter, setAdsFilter] = useState<JobAdsFilter>(DEFAULT_JOB_ADS_FILTER)
  const [dialogOpen, setDialogOpen] = useState(false)
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

  const feed = useFeed<JobAdsFeed>('job-ads')
  const addManualJobAd = useCommand('job-ads', 'add-manual')
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds

  const onAdsFilterChange = useCallback((filter: JobAdsFilter) => {
    setAdsFilter(filter)
  }, [])

  const onAddManualJobAd = useCallback(
    (payload: AddManualJobAdPayload) => {
      addManualJobAd(JSON.stringify(payload))
      setAdsFilter(payload.applyStatus)
      setDialogOpen(false)
    },
    [addManualJobAd],
  )

  if (feed === undefined) {
    return (
      <BaseCard cardId='job-ads' title={labels.title} icon={JobAdsIcon} height={14} extraHeight={4} allowZoom={false}>
        {null}
      </BaseCard>
    )
  }

  return (
    <>
      <BaseCard
        cardId='job-ads'
        title={labels.title}
        icon={JobAdsIcon}
        height={14}
        extraHeight={4}
        allowZoom={false}
        headingInfo={countJobAdsEditViewAds(feed.ads, adsFilter)}
        actions={
          <>
            {isSmUp && adsFilter === 'pending-review' ? (
              <AcceptableSalarySlider salaryRange={feed.salaryRange} acceptableSalary={feed.acceptableSalary} />
            ) : null}
            <ApolloCardAction title={labels.addManualJobAd} onClick={() => setDialogOpen(true)} Icon={PlusIcon} />
            <JobAdsFilterSelect value={adsFilter} onChange={onAdsFilterChange} />
          </>
        }
      >
        <JobAdsEditView ads={feed.ads} zoom={true} filter={adsFilter} />
      </BaseCard>
      <AddManualJobAdDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={onAddManualJobAd} />
    </>
  )
}

export default JobAds
