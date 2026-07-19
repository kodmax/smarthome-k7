import { JobAdWithMeta } from '@repo/types'
import { FC, useMemo } from 'react'
import { isFavSkill } from './isFavSkill'

export const AdTitleText: FC<{ ad: JobAdWithMeta; zoom: boolean }> = ({ ad, zoom }) => {
  const favSkills = useMemo(() => ad.requiredSkills.filter(isFavSkill), [ad.requiredSkills])

  if (!zoom) {
    return <>{ad.title}</>
  }

  return (
    <>
      {ad.title} {ad.employmentType === 'permanent' ? '[Perm]' : '[B2B]'} [{ad.workplaceType}]{' '}
      {favSkills.map(skillName => (
        <span key={skillName}>[{skillName}]</span>
      ))}
    </>
  )
}
