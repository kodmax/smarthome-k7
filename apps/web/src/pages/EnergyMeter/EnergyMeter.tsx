import { EnergyIcon } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/components/PageHeader'
import { PageWrapper } from '@/app/components/PageWrapper'
import { EnergyMeterCard } from './EnergyMeterCard'

export const EnergyMeter: FC<Record<string, never>> = () => (
  <PageWrapper>
    <PageHeader
      icon={EnergyIcon}
      title='Pomiar energii'
      description='Monitoruj zużycie energii i koszt w czasie rzeczywistym'
    />

    <EnergyMeterCard />
  </PageWrapper>
)
