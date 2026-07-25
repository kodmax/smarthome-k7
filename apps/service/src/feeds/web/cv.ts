import { Feeds } from '@repo/apollo-ws'
import { CvSource } from '@/data-sources'

export const addCvFeed = (feeds: Feeds): Promise<void> => feeds.addFeed('cv', { cv: CvSource })
