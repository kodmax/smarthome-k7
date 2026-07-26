import { JobAdsFeedItem } from '@repo/types'
import { FC } from 'react'
import { JobTitleText } from './styled'

export const AdTitleText: FC<{ ad: JobAdsFeedItem }> = ({ ad }) => {
  return <JobTitleText>{ad.content.title}</JobTitleText>
}
