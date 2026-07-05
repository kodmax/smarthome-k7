import { JobAd } from '@repo/types'
import { FC, useMemo } from 'react'
import { ApolloTableRow, LinkOpen } from '@/card-components'
import { JobTitle, Salary } from './styled'
import { formatJobSalary } from './formatJobSalary'
import { isFavSkill } from './isFavSkill'

export const Ad: FC<{ ad: JobAd; zoom: boolean }> = ({ ad, zoom }) => {
  const favSkills = useMemo(() => ad.requiredSkills.filter(isFavSkill), [ad])
  const { monthlySalaryFrom, monthlySalaryTo, b2bHourlyRateEquivalent } = useMemo(() => formatJobSalary(ad), [ad])

  return (
    <ApolloTableRow>
      {zoom ? <LinkOpen href={ad.advertUrl} /> : null}
      <JobTitle>
        {zoom ? (
          <>
            {ad.title} {ad.employmentType === 'permanent' ? '[Perm]' : '[B2B]'} [{ad.workplaceType}]{' '}
            {favSkills.map(skillName => (
              <span key={skillName}>[{skillName}]</span>
            ))}
          </>
        ) : (
          ad.title
        )}
      </JobTitle>
      <Salary>
        {ad.monthlySalaryRangeAfterTaxes !== undefined ? (
          <>
            {monthlySalaryFrom}k — {monthlySalaryTo}k
          </>
        ) : null}
      </Salary>
      {zoom ? (
        <Salary>{ad.monthlySalaryRangeAfterTaxes !== undefined ? <>{b2bHourlyRateEquivalent}/h</> : null}</Salary>
      ) : null}
    </ApolloTableRow>
  )
}
