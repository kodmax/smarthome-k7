import { FeedManager } from '@repo/feeds'
import { WeatherSource } from '@/data-sources'

export const addWeatherFeed = (feeds: FeedManager): Promise<void> =>
  feeds.addFeed('weather', { weather: WeatherSource })
