import { JobAd } from '@repo/types'
import { FC, useMemo } from 'react'
import { Company, JobTitle, Logo, Open, Salary } from './styled'
import LinkOpen from '../components/LinkOpen'
import { isFavSkill } from './isFavSkill'

export const Ad: FC<{ ad: JobAd; zoom: boolean }> = ({ ad, zoom }) => {
  const favSkills = useMemo(() => ad.requiredSkills.filter(isFavSkill), [ad])

  const [monthlySalaryFrom, monthlySalaryTo, b2bHourlyRateEquivalent] = useMemo(
    () => [
      ad.monthlySalaryRangeAfterTaxes !== undefined ? Math.round(ad.monthlySalaryRangeAfterTaxes.from / 1000) : null,
      ad.monthlySalaryRangeAfterTaxes !== undefined ? Math.round(ad.monthlySalaryRangeAfterTaxes.to / 1000) : null,
      ad.monthlySalaryRangeAfterTaxes !== undefined
        ? Math.round((ad.monthlySalaryRangeAfterTaxes.to / 0.88 + 1000) / 150)
        : null,
    ],
    [ad],
  )

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
        {zoom ? (
          <>
            {ad.title} {ad.employmentType === 'permanent' ? '[Perm]' : '[B2B]'} [{ad.workplaceType}]{' '}
            {favSkills.map(skillName => (
              <>[{skillName}]</>
            ))}
          </>
        ) : (
          ad.title
        )}
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
