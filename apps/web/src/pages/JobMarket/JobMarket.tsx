import { Grid } from '@mui/material'
import { ZoomStateProvider } from '@repo/apollo-card'
import { JobsIcon, iconStyles } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/components/PageHeader'
import { PageWrapper } from '@/app/components/PageWrapper'
import { useTranslations } from '@/i18n'
import { ActiveOffers } from './cards/ActiveOffers/ActiveOffers'
import { MedianSalary } from './cards/MedianSalary/MedianSalary'
import { NewOffers } from './cards/NewOffers/NewOffers'
import { OffersWithSalaryRange } from './cards/OffersWithSalaryRange/OffersWithSalaryRange'
import { PermanentEmployment } from './cards/PermanentEmployment/PermanentEmployment'
import { WorkModeSplit } from './cards/WorkModeSplit/WorkModeSplit'
import { PopularTechnologies } from './cards/PopularTechnologies/PopularTechnologies'
import { SalaryDistribution } from './cards/SalaryDistribution/SalaryDistribution'
import { Jobs } from './cards/Jobs'

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

      <ZoomStateProvider>
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
          <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
            <PopularTechnologies />
          </Grid>
          <Grid size={{ xs: 12, lg: 6, xl: 6 }}>
            <SalaryDistribution />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <Jobs />
          </Grid>
        </Grid>
      </ZoomStateProvider>
    </PageWrapper>
  )
}
