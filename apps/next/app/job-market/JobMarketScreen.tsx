'use client'

import { iconStyles, JobAdsIcon } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/shell/components/PageHeader'
import { PageWrapper } from '@/app/shell/components/PageWrapper'

type JobMarketScreenProps = {
  title: string
  description: string
}

export const JobMarketScreen: FC<JobMarketScreenProps> = ({ title, description }) => (
  <PageWrapper>
    <PageHeader title={title} description={description} icon={JobAdsIcon} iconColor={iconStyles.jobAds.color} />
  </PageWrapper>
)
