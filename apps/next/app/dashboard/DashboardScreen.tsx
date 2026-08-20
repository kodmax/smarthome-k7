'use client'

import { DashboardIcon, iconStyles } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/shell/components/PageHeader'
import { PageWrapper } from '@/app/shell/components/PageWrapper'

type DashboardScreenProps = {
  title: string
  description: string
}

export const DashboardScreen: FC<DashboardScreenProps> = ({ title, description }) => (
  <PageWrapper>
    <PageHeader title={title} description={description} icon={DashboardIcon} iconColor={iconStyles.weather.color} />
  </PageWrapper>
)
