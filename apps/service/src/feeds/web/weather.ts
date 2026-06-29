import { Feeds } from '@repo/apollo-ws'
import { weather } from '@/data-sources'

export const addWeatherFeed = (feeds: Feeds): Promise<void> => feeds.addFeed('weather', { weather })
