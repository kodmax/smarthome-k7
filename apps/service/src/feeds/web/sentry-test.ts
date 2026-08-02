import { FeedManager } from '@repo/feeds'
import { SentryTestSource } from '@/data-sources'

export const addSentryTestFeed = (feeds: FeedManager): Promise<void> =>
  feeds.addFeed('sentry-test', { sentryTest: SentryTestSource })
