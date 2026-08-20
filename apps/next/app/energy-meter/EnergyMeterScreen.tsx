'use client'

import { EnergyIcon, iconStyles } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/shell/components/PageHeader'
import { PageWrapper } from '@/app/shell/components/PageWrapper'

type EnergyMeterScreenProps = {
  title: string
  description: string
}

export const EnergyMeterScreen: FC<EnergyMeterScreenProps> = ({ title, description }) => (
  <PageWrapper>
    <PageHeader title={title} description={description} icon={EnergyIcon} iconColor={iconStyles.energy.color} />
  </PageWrapper>
)
