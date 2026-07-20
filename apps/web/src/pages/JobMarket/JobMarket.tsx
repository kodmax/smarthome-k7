import { JobsIcon, iconStyles } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/components/PageHeader'
import { PageWrapper } from '@/app/components/PageWrapper'
import { useTranslations } from '@/i18n'

export const JobMarket: FC<Record<string, never>> = () => {
  const { t } = useTranslations()

  return (
    <PageWrapper>
      <PageHeader
        icon={JobsIcon}
        iconColor={iconStyles.jobs.color}
        title={t.jobMarket.title}
        description={t.jobMarket.description}
      />
    </PageWrapper>
  )
}
