import { FeedManager } from '@repo/feeds'
import { TransmissionSource } from '@/data-sources'

export const addTransmissionFeed = (feeds: FeedManager): Promise<void> =>
  feeds.addFeed('transmission', { transmission: TransmissionSource })
