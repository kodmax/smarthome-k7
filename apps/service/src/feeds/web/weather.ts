import { Feeds } from '@repo/apollo-ws'
import { WeatherSource } from '@/data-sources'

export const addWeatherFeed = (feeds: Feeds): Promise<void> => feeds.addFeed('weather', { weather: WeatherSource })
