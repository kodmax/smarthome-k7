import { type JobsFeed } from '@repo/types'
import { jobAd } from './jobs'

export function jobsFeed(...ads: JobsFeed['ads']): JobsFeed {
  return { ads }
}

export function jobsFeedWithDefaults(count = 1): JobsFeed {
  return jobsFeed(
    ...Array.from({ length: count }, (_, index) => jobAd({ id: String(index + 1), title: `Job ${index + 1}` })),
  )
}
