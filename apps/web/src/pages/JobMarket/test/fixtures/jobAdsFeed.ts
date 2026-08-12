import { type JobAdsFeed } from '@repo/types'
import { jobAd } from './jobAd'

export function jobAdsFeed(...ads: JobAdsFeed['ads']): JobAdsFeed {
  return { ads, acceptableSalary: null }
}

export function jobAdsFeedWithDefaults(count = 1): JobAdsFeed {
  return jobAdsFeed(
    ...Array.from({ length: count }, (_, index) => jobAd({ id: String(index + 1), title: `Job ${index + 1}` })),
  )
}
