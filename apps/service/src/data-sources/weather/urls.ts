export const ACCUWEATHER_BASE = 'https://www.accuweather.com/pl/pl/warsaw/274663'

export const weatherPageUrls = {
  forecast: `${ACCUWEATHER_BASE}/10-day-weather-forecast/274663`,
  instant: `${ACCUWEATHER_BASE}/current-weather/274663`,
  allergens: `${ACCUWEATHER_BASE}/weather-forecast/274663`,
  hourly: `${ACCUWEATHER_BASE}/hourly-weather-forecast/274663`,
  airQuality: `${ACCUWEATHER_BASE}/air-quality-index/274663`,
} as const
