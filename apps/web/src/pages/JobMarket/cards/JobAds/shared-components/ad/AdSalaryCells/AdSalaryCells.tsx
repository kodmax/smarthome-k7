import { JobAdsFeedItem } from '@repo/types'
import { Box } from '@mui/material'
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

const SalaryCellContent: FC<{ ad: JobAdsFeedItem; children: ReactNode }> = ({ ad, children }) => (
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
    <WorkplaceTypeIndicator workplaceType={ad.content.workplaceType} />
    <EmploymentTypeIndicator employmentType={ad.content.employmentType} />
    {children}
  </Box>
)

export const AdSalaryCells: FC<Props> = ({ ad, zoom, showHourlySalaryOnXs = false }) => {
  const { monthlySalaryFrom, monthlySalaryTo, b2bHourlyRateEquivalent } = useMemo(
    () => formatJobSalary(ad.content),
    [ad.content],
  )
  const hourlySalaryValue =
    b2bHourlyRateEquivalent !== null ? <ReadingValue displayValue={b2bHourlyRateEquivalent} unit='PLN/h' /> : null
  const monthlySalaryValue =
    ad.content.monthlySalaryRangeAfterTaxes !== undefined ? (
      <ReadingValue displayValue={`${monthlySalaryFrom} — ${monthlySalaryTo}`} unit='kPLN' />
    ) : null

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
