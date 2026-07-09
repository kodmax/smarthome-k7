import { Feeds } from '@repo/apollo-ws'
import { TransmissionSource } from '@/data-sources'

export const addTransmissionFeed = (feeds: Feeds): Promise<void> =>
  feeds.addFeed('transmission', { transmission: TransmissionSource })
