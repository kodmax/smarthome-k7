import { JobAdWithMeta } from '@repo/types'
import { FC } from 'react'

export const AdTitleText: FC<{ ad: JobAdWithMeta }> = ({ ad }) => {
  return <>{ad.title}</>
}
