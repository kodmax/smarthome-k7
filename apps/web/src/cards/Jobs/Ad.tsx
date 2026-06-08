import { JobAd } from '@repo/types'
import { FC } from 'react'
import { Company, JobTitle, Logo, Open, Salary } from './styled'
import LinkOpen from '../components/LinkOpen'

export const Ad: FC<{ ad: JobAd; zoom: boolean }> = ({ ad, zoom }) => {
  const monthlySalaryFrom =
    ad.monthlySalaryRangeAfterTaxes !== undefined ? Math.round(ad.monthlySalaryRangeAfterTaxes.from / 1000) : null
  const monthlySalaryTo =
    ad.monthlySalaryRangeAfterTaxes !== undefined ? Math.round(ad.monthlySalaryRangeAfterTaxes.to / 1000) : null
  const b2bHourlyRateEquivalent =
    ad.monthlySalaryRangeAfterTaxes !== undefined
      ? Math.round((ad.monthlySalaryRangeAfterTaxes.to / 0.88 + 1000) / 150)
      : null

  return (
    <>
      <Company>
        {' '}
        {ad.companyLogoUrl ? <Logo src={ad.companyLogoUrl} isUnwanted={ad.isUnwantedCompany} /> : ad.companyName}{' '}
      </Company>
      {zoom ? (
        <Open>
          {' '}
          <LinkOpen href={ad.advertUrl} />{' '}
        </Open>
      ) : null}
      <JobTitle>
        {ad.title}
        {zoom ? <>{ad.employmentType === 'permanent' ? ' [Perm]' : ' [B2B]'}</> : null}
      </JobTitle>
      <Salary>
        {' '}
        {ad.monthlySalaryRangeAfterTaxes !== undefined ? (
          <>
            {monthlySalaryFrom}k — {monthlySalaryTo}k{zoom ? <>({b2bHourlyRateEquivalent}/h)</> : null}
          </>
        ) : null}
      </Salary>
    </>
  )
}
