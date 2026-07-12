import { EnergyIcon } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/components/PageHeader'
import { PageWrapper } from '@/app/components/PageWrapper'
import { useTranslations } from '@/i18n'
import { EnergyMeterCard } from './EnergyMeterCard'

export const EnergyMeter: FC<Record<string, never>> = () => {
  const { t } = useTranslations()

  return (
    <PageWrapper>
      <PageHeader icon={EnergyIcon} title={t.energyMeter.title} description={t.energyMeter.description} />

      <EnergyMeterCard />
    </PageWrapper>
  )
}
