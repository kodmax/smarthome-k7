import { Feeds } from '@repo/apollo-ws'
import { SentryTestSource } from '@/data-sources'

export const addSentryTestFeed = (feeds: Feeds): Promise<void> =>
  feeds.addFeed('sentry-test', { sentryTest: SentryTestSource })
