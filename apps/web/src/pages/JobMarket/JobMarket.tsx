import { Grid } from '@mui/material'
import { JobsIcon, iconStyles } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/components/PageHeader'
import { PageWrapper } from '@/app/components/PageWrapper'
import { useTranslations } from '@/i18n'
import { ActiveOffers } from './tiles/ActiveOffers/ActiveOffers'
import { MedianSalary } from './tiles/MedianSalary/MedianSalary'
import { NewOffers } from './tiles/NewOffers/NewOffers'
import { OffersWithSalaryRange } from './tiles/OffersWithSalaryRange/OffersWithSalaryRange'
import { PermanentEmployment } from './tiles/PermanentEmployment/PermanentEmployment'
import { WorkModeSplit } from './tiles/WorkModeSplit/WorkModeSplit'
import { PopularTechnologies } from './tiles/PopularTechnologies/PopularTechnologies'
import { SalaryDistribution } from './tiles/SalaryDistribution/SalaryDistribution'

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

      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
          <ActiveOffers />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
          <NewOffers />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
          <MedianSalary />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
          <OffersWithSalaryRange />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
          <WorkModeSplit />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 2 }}>
          <PermanentEmployment />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <PopularTechnologies />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SalaryDistribution />
        </Grid>
      </Grid>
    </PageWrapper>
  )
}
