import { JobAdWithMeta } from '@repo/types'
import { FC, useMemo } from 'react'
import { ReadingValue } from '@/card-components'
import { formatJobSalary } from './formatJobSalary'
import { Salary } from './styled'

export const AdSalaryCells: FC<{ ad: JobAdWithMeta; zoom: boolean }> = ({ ad, zoom }) => {
  const { monthlySalaryFrom, monthlySalaryTo, b2bHourlyRateEquivalent } = useMemo(() => formatJobSalary(ad), [ad])

  return (
    <>
      <Salary>
        {ad.monthlySalaryRangeAfterTaxes !== undefined ? (
          <ReadingValue displayValue={`${monthlySalaryFrom} — ${monthlySalaryTo}`} unit='kPLN' />
        ) : null}
      </Salary>
      {zoom ? (
        <Salary>
          {b2bHourlyRateEquivalent !== null ? (
            <ReadingValue displayValue={b2bHourlyRateEquivalent} unit='PLN/h' />
          ) : null}
        </Salary>
      ) : null}
    </>
  )
}
