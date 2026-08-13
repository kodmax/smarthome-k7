import { JobAdsFeedItem } from '@repo/types'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { FC, ReactNode, useMemo } from 'react'
import { ReadingValue } from '@/card-components'
import { HourlySalaryCellXsOnly, MonthlySalaryRangeCell, Salary } from '../styled'
import { WorkplaceTypeIndicator } from '../AdTitleTrailing/WorkplaceTypeIndicator'
import { EmploymentTypeIndicator } from './EmploymentTypeIndicator'
import { formatJobSalary } from './formatJobSalary'

type Props = {
  ad: JobAdsFeedItem
  zoom: boolean
  showHourlySalaryOnXs?: boolean
}

const SalaryCellContent: FC<{ ad: JobAdsFeedItem; children: ReactNode }> = ({ ad, children }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 0.5,
        width: '100%',
        minWidth: 0,
      }}
    >
      {isSmallScreen ? null : (
        <>
          <Box sx={{ flex: '0 0 16px' }}>
            <WorkplaceTypeIndicator workplaceType={ad.content.workplaceType} />
          </Box>
          <Box sx={{ flex: '0 0 16px' }}>
            <EmploymentTypeIndicator employmentType={ad.content.employmentType} />
          </Box>
        </>
      )}
      <Box sx={{ flex: '0 0 88px' }}>{children}</Box>
    </Box>
  )
}

export const AdSalaryCells: FC<Props> = ({ ad, zoom, showHourlySalaryOnXs = false }) => {
  const { monthlySalaryTo, b2bHourlyRateEquivalent } = useMemo(() => formatJobSalary(ad.content), [ad.content])
  const hourlySalaryValue =
    b2bHourlyRateEquivalent !== null ? <ReadingValue displayValue={b2bHourlyRateEquivalent} unit='PLN/h' /> : null
  const monthlySalaryValue =
    monthlySalaryTo !== null ? <ReadingValue displayValue={monthlySalaryTo.toFixed(1)} unit='kPLN' /> : null

  return (
    <>
      <MonthlySalaryRangeCell>
        <SalaryCellContent ad={ad}>{monthlySalaryValue}</SalaryCellContent>
      </MonthlySalaryRangeCell>
      {zoom ? <Salary>{hourlySalaryValue}</Salary> : null}
      {!zoom && showHourlySalaryOnXs ? (
        <HourlySalaryCellXsOnly>
          <SalaryCellContent ad={ad}>{hourlySalaryValue}</SalaryCellContent>
        </HourlySalaryCellXsOnly>
      ) : null}
    </>
  )
}
