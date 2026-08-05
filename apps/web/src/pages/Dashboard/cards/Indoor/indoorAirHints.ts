import {
  HOT_OUTDOOR_MIN_C,
  VENTILATION_MAX_OUTDOOR_AQI,
  VENTILATION_MAX_WIND_MS,
  VENTILATION_MIN_OUTDOOR_TEMP_C,
  type IndoorHintKey,
  indoorHintOrder,
} from '@/app/hints'

const CO2_ELEVATED_MIN = 1000
const CO2_VENTILATE_MIN = 1500
const INDOOR_HUMIDITY_HIGH = 60

const INDOOR_AIR_HINTS: IndoorHintKey[] = ['highCo2', 'elevatedCo2', 'highHumidity']

export type IndoorAirHintsInput = {
  co2Ppm: number | undefined
  indoorHumidity: number | undefined
  outdoorTempC: number | undefined
  outdoorAqi: number | undefined
  windSpeedMs: number | undefined
}

type IndoorAirHintsData = IndoorAirHintsInput & {
  co2Ppm: number
  indoorHumidity: number
  outdoorTempC: number
  outdoorAqi: number
  windSpeedMs: number
}

const hasRequiredData = (input: IndoorAirHintsInput): input is IndoorAirHintsData =>
  input.co2Ppm !== undefined &&
  input.indoorHumidity !== undefined &&
  input.outdoorTempC !== undefined &&
  input.outdoorAqi !== undefined &&
  input.windSpeedMs !== undefined

const isOutdoorVentilationBlocked = (outdoorTempC: number, outdoorAqi: number, windSpeedMs: number) =>
  outdoorTempC >= HOT_OUTDOOR_MIN_C ||
  outdoorTempC < VENTILATION_MIN_OUTDOOR_TEMP_C ||
  outdoorAqi > VENTILATION_MAX_OUTDOOR_AQI ||
  windSpeedMs > VENTILATION_MAX_WIND_MS

export const indoorAirHints = (input: IndoorAirHintsInput): IndoorHintKey[] => {
  if (!hasRequiredData(input)) {
    return []
  }

  const { co2Ppm, indoorHumidity, outdoorTempC, outdoorAqi, windSpeedMs } = input
  const hints: IndoorHintKey[] = []

  if (co2Ppm >= CO2_VENTILATE_MIN) {
    hints.push('highCo2')
  } else if (co2Ppm >= CO2_ELEVATED_MIN) {
    hints.push('elevatedCo2')
  }

  if (indoorHumidity > INDOOR_HUMIDITY_HIGH) {
    hints.push('highHumidity')
  }

  const visibleHints = isOutdoorVentilationBlocked(outdoorTempC, outdoorAqi, windSpeedMs)
    ? hints.filter(key => !INDOOR_AIR_HINTS.includes(key))
    : hints

  return indoorHintOrder.filter(key => visibleHints.includes(key))
}
