import {
  FROST_MAX_C,
  HIGH_UV_MIN,
  HOT_OUTDOOR_MIN_C,
  STRONG_WIND_MIN_MS,
  VENTILATION_MAX_OUTDOOR_AQI,
  type WeatherHintContext,
  type WeatherHintKey,
  weatherHintOrder,
} from '@/app/hints'

export type CurrentWeatherHintsInput = {
  windSpeedMs: number | undefined
  outdoorTempC: number | undefined
  uv: number | undefined
  outdoorAqi: number | undefined
}

type CurrentWeatherHintsData = CurrentWeatherHintsInput & {
  windSpeedMs: number
  outdoorTempC: number
  uv: number
  outdoorAqi: number
}

const hasRequiredData = (input: CurrentWeatherHintsInput): input is CurrentWeatherHintsData =>
  input.windSpeedMs !== undefined &&
  input.outdoorTempC !== undefined &&
  input.uv !== undefined &&
  input.outdoorAqi !== undefined

export const currentWeatherHints = (
  input: CurrentWeatherHintsInput,
): { hints: WeatherHintKey[]; context: WeatherHintContext | undefined } => {
  if (!hasRequiredData(input)) {
    return { hints: [], context: undefined }
  }

  const { windSpeedMs, outdoorTempC, uv, outdoorAqi } = input
  const hints: WeatherHintKey[] = []

  if (windSpeedMs >= STRONG_WIND_MIN_MS) {
    hints.push('strongWind')
  }

  if (outdoorTempC >= HOT_OUTDOOR_MIN_C) {
    hints.push('hotOutdoor')
  }

  if (uv >= HIGH_UV_MIN) {
    hints.push('highUv')
  }

  if (outdoorTempC <= FROST_MAX_C) {
    hints.push('frost')
  }

  if (outdoorAqi > VENTILATION_MAX_OUTDOOR_AQI) {
    hints.push('poorOutdoorAir')
  }

  return {
    hints: weatherHintOrder.filter(key => hints.includes(key)),
    context: { windSpeedMs, outdoorTempC, uv, outdoorAqi },
  }
}
