import { JobAdWithMeta } from '@repo/types'
import { FC } from 'react'
import { JobTitleText } from './styled'

export const AdTitleText: FC<{ ad: JobAdWithMeta }> = ({ ad }) => {
  return <JobTitleText>{ad.title}</JobTitleText>
}
