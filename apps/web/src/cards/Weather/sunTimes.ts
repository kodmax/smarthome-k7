import { WeatherData } from '@repo/types'

type SunRiseSunSet = {
  timeOfDay: 'day' | 'night'
  time: string
}

export function sunTimes(data: WeatherData): SunRiseSunSet {
  if (new Date(data.sunTimes.dawn).getTime() - new Date().getTime() > 0) {
    return { timeOfDay: 'night', time: new Date(data.sunTimes.dawn).toLocaleTimeString().substring(0, 5) }
  } else if (new Date(data.sunTimes.dusk).getTime() - new Date().getTime() > 0) {
    return { timeOfDay: 'day', time: new Date(data.sunTimes.dusk).toLocaleTimeString().substring(0, 5) }
  } else {
    return { timeOfDay: 'night', time: new Date(data.sunTimes.dawn).toLocaleTimeString().substring(0, 5) }
  }
}
