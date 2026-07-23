import { Box, Grid } from '@mui/material'
import { cardGridSpacing } from '@repo/design-tokens'
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
import { RemoteWorkModeSplit, OfficeWorkModeSplit, HybridWorkModeSplit } from './cards/WorkMode'
import { PopularTechnologies } from './cards/PopularTechnologies/PopularTechnologies'
import { SalaryDistribution } from './cards/SalaryDistribution/SalaryDistribution'
import { Jobs } from './cards/Jobs'
import { OffersWithSalaryRange } from './cards/OffersWithSalaryRange/OffersWithSalaryRange'

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
          spacing={cardGridSpacing}
          sx={{
            display: 'grid',
            alignItems: 'start',
            width: '100%',
            gap: 'var(--Grid-rowSpacing) var(--Grid-columnSpacing)',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(6, 1fr)',
              xl: 'repeat(6, 1fr)',
            },
            gridTemplateAreas: {
              xs: `
                "activeOffers"
                "newOffers"
                "medianSalary"
                "p90salary"
                "ads-with-range"
                "permanentEmployment"
                "remote-work-mode-split"
                "hybrid-work-mode-split"
                "office-work-mode-split"
                "required-skills"
                "salary-distribution"
                "job-ads"
              `,
              sm: `
                "activeOffers newOffers"
                "medianSalary p90salary"
                "ads-with-range permanentEmployment"
                "remote-work-mode-split hybrid-work-mode-split"
                "office-work-mode-split office-work-mode-split"
                "required-skills required-skills"
                "salary-distribution salary-distribution"
                "job-ads job-ads"
              `,
              lg: `
                "activeOffers activeOffers newOffers newOffers medianSalary medianSalary"
                "p90salary p90salary ads-with-range ads-with-range permanentEmployment permanentEmployment"
                "remote-work-mode-split remote-work-mode-split hybrid-work-mode-split hybrid-work-mode-split office-work-mode-split office-work-mode-split"
                "required-skills required-skills required-skills job-ads job-ads job-ads"
                "salary-distribution salary-distribution salary-distribution job-ads job-ads job-ads"
              `,
              xl: `
                "activeOffers newOffers medianSalary p90salary ads-with-range permanentEmployment"
                "required-skills required-skills job-ads job-ads job-ads remote-work-mode-split"
                "required-skills required-skills job-ads job-ads job-ads hybrid-work-mode-split"
                "salary-distribution salary-distribution job-ads job-ads job-ads office-work-mode-split"
                "salary-distribution salary-distribution job-ads job-ads job-ads ."
              `,
            },
          }}
        >
          <Box sx={{ gridArea: 'activeOffers' }}>
            <ActiveOffers />
          </Box>
          <Box sx={{ gridArea: 'newOffers' }}>
            <NewOffers />
          </Box>
          <Box sx={{ gridArea: 'medianSalary' }}>
            <MedianSalary />
          </Box>
          <Box sx={{ gridArea: 'p90salary' }}>
            <P90Salary />
          </Box>
          <Box sx={{ gridArea: 'remote-work-mode-split' }}>
            <RemoteWorkModeSplit />
          </Box>
          <Box sx={{ gridArea: 'hybrid-work-mode-split' }}>
            <HybridWorkModeSplit />
          </Box>
          <Box sx={{ gridArea: 'office-work-mode-split' }}>
            <OfficeWorkModeSplit />
          </Box>
          <Box sx={{ gridArea: 'permanentEmployment' }}>
            <PermanentEmployment />
          </Box>
          <Box sx={{ gridArea: 'required-skills' }}>
            <PopularTechnologies />
          </Box>
          <Box sx={{ gridArea: 'salary-distribution' }}>
            <SalaryDistribution />
          </Box>
          <Box sx={{ gridArea: 'job-ads' }}>
            <Jobs />
          </Box>
          <Box sx={{ gridArea: 'job-ads' }}>
            <Jobs />
          </Box>
          <Box sx={{ gridArea: 'ads-with-range' }}>
            <OffersWithSalaryRange />
          </Box>
        </Grid>
      </ZoomStateProvider>
    </PageWrapper>
  )
}
