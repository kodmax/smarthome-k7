import { JobAdWithMeta } from '@repo/types'
import { FC, useMemo } from 'react'
import { ReadingValue } from '@/card-components'
import { HourlySalaryCellXsOnly, MonthlySalaryRangeCell, Salary } from '../styled'
import { formatJobSalary } from './formatJobSalary'

type Props = {
  ad: JobAdWithMeta
  zoom: boolean
  showHourlySalaryOnXs?: boolean
}

export const AdSalaryCells: FC<Props> = ({ ad, zoom, showHourlySalaryOnXs = false }) => {
  const { monthlySalaryFrom, monthlySalaryTo, b2bHourlyRateEquivalent } = useMemo(() => formatJobSalary(ad), [ad])
  const hourlySalaryValue =
    b2bHourlyRateEquivalent !== null ? <ReadingValue displayValue={b2bHourlyRateEquivalent} unit='PLN/h' /> : null

  return (
    <>
      <MonthlySalaryRangeCell>
        {ad.monthlySalaryRangeAfterTaxes !== undefined ? (
          <ReadingValue displayValue={`${monthlySalaryFrom} — ${monthlySalaryTo}`} unit='kPLN' />
        ) : null}
      </MonthlySalaryRangeCell>
      {zoom ? <Salary>{hourlySalaryValue}</Salary> : null}
      {!zoom && showHourlySalaryOnXs ? <HourlySalaryCellXsOnly>{hourlySalaryValue}</HourlySalaryCellXsOnly> : null}
    </>
  )
}
