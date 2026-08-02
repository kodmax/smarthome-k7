import { FeedManager } from '@repo/feeds'
import { CvSource } from '@/data-sources'

export const addCvFeed = (feeds: FeedManager): Promise<void> => feeds.addFeed('cv', { cv: CvSource })
