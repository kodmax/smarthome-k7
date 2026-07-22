import { Box, Grid } from '@mui/material'
import { ZoomStateProvider } from '@repo/apollo-card'
import { JobsIcon, iconStyles } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/components/PageHeader'
import { PageWrapper } from '@/app/components/PageWrapper'
import { useTranslations } from '@/i18n'
import { ActiveOffers } from './cards/ActiveOffers/ActiveOffers'
import { MedianSalary } from './cards/MedianSalary/MedianSalary'
import { P90Salary } from './cards/P90Salary/P90Salary'
import { NewOffers } from './cards/NewOffers/NewOffers'
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
        <Grid
          container
          spacing={3}
          sx={{
            display: 'grid',
            alignItems: 'start',
            width: '100%',
            gap: 'var(--Grid-rowSpacing) var(--Grid-columnSpacing)',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              xl: 'repeat(12, 1fr)',
            },
            gridTemplateAreas: {
              xs: `
                "activeOffers"
                "newOffers"
                "medianSalary"
                "offersWithSalaryRange"
                "workModeSplit"
                "permanentEmployment"
                "popular"
                "salary"
                "jobs"
              `,
              sm: `
                "activeOffers newOffers"
                "medianSalary offersWithSalaryRange"
                "workModeSplit permanentEmployment"
                "popular popular"
                "salary salary"
                "jobs jobs"
              `,
              lg: `
                "activeOffers newOffers"
                "medianSalary offersWithSalaryRange"
                "workModeSplit permanentEmployment"
                "popular salary"
                "popular jobs"
              `,
              xl: `
                "activeOffers activeOffers newOffers newOffers medianSalary medianSalary offersWithSalaryRange offersWithSalaryRange workModeSplit workModeSplit permanentEmployment permanentEmployment"
                "popular popular popular popular salary salary salary salary salary salary salary salary"
                "popular popular popular popular jobs jobs jobs jobs jobs jobs jobs jobs"
              `,
            },
          }}
        >
          <Box sx={{ gridArea: 'activeOffers', minWidth: 0 }}>
            <ActiveOffers />
          </Box>
          <Box sx={{ gridArea: 'newOffers', minWidth: 0 }}>
            <NewOffers />
          </Box>
          <Box sx={{ gridArea: 'medianSalary', minWidth: 0 }}>
            <MedianSalary />
          </Box>
          <Box sx={{ gridArea: 'offersWithSalaryRange', minWidth: 0 }}>
            <P90Salary />
          </Box>
          <Box sx={{ gridArea: 'workModeSplit', minWidth: 0 }}>
            <WorkModeSplit />
          </Box>
          <Box sx={{ gridArea: 'permanentEmployment', minWidth: 0 }}>
            <PermanentEmployment />
          </Box>
          <Box sx={{ gridArea: 'popular', minWidth: 0 }}>
            <PopularTechnologies />
          </Box>
          <Box sx={{ gridArea: 'salary', minWidth: 0 }}>
            <SalaryDistribution />
          </Box>
          <Box sx={{ gridArea: 'jobs', minWidth: 0 }}>
            <Jobs />
          </Box>
        </Grid>
      </ZoomStateProvider>
    </PageWrapper>
  )
}
