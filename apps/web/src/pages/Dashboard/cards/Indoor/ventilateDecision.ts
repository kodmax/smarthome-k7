import { optimalHumidityRange } from '../Weather/optimalHumidityRange'

const CO2_COMFORT_MAX = 700
const CO2_ELEVATED_MIN = 1000
const CO2_VENTILATE_MIN = 1500
const OUTDOOR_TEMP_MIN_C = 4
const OUTDOOR_TEMP_MAX_C = 28
const OUTDOOR_AQI_MAX = 100
const INDOOR_HUMIDITY_HIGH = 60
const WIND_SPEED_MAX_MS = 14

export type VentilateVerdict = 'yes' | 'maybe' | 'no' | 'not_now' | 'unknown'

export type VentilateReasonKey =
  | 'highCo2'
  | 'elevatedCo2'
  | 'highHumidity'
  | 'tooCold'
  | 'tooHot'
  | 'poorOutdoorAir'
  | 'tooWindy'
  | 'comfortable'
  | 'missingData'

export type VentilateInput = {
  co2Ppm: number | undefined
  indoorHumidity: number | undefined
  outdoorTempC: number | undefined
  outdoorHumidity: number | undefined
  outdoorAqi: number | undefined
  windSpeedMs: number | undefined
}

export type VentilateResult = {
  verdict: VentilateVerdict
  reasonKey: VentilateReasonKey
}

const isHumidityComfortable = (humidity: number) =>
  humidity >= optimalHumidityRange.lowest && humidity <= optimalHumidityRange.highest

export const shouldShowVentilateHint = (verdict: VentilateVerdict) => verdict === 'yes' || verdict === 'maybe'

export const ventilateDecision = (input: VentilateInput): VentilateResult => {
  const { co2Ppm, indoorHumidity, outdoorTempC, outdoorHumidity, outdoorAqi, windSpeedMs } = input

  if (
    co2Ppm === undefined ||
    indoorHumidity === undefined ||
    outdoorTempC === undefined ||
    outdoorHumidity === undefined ||
    outdoorAqi === undefined ||
    windSpeedMs === undefined
  ) {
    return { verdict: 'unknown', reasonKey: 'missingData' }
  }

  if (outdoorTempC < OUTDOOR_TEMP_MIN_C) {
    return { verdict: 'not_now', reasonKey: 'tooCold' }
  }

  if (outdoorTempC > OUTDOOR_TEMP_MAX_C) {
    return { verdict: 'not_now', reasonKey: 'tooHot' }
  }

  if (outdoorAqi > OUTDOOR_AQI_MAX) {
    return { verdict: 'not_now', reasonKey: 'poorOutdoorAir' }
  }

  if (windSpeedMs > WIND_SPEED_MAX_MS) {
    return { verdict: 'not_now', reasonKey: 'tooWindy' }
  }

  const outdoorAirDrier = outdoorHumidity < indoorHumidity - 5
  const humidityHigh = indoorHumidity > INDOOR_HUMIDITY_HIGH

  if (co2Ppm < CO2_COMFORT_MAX && isHumidityComfortable(indoorHumidity)) {
    return { verdict: 'no', reasonKey: 'comfortable' }
  }

  if (co2Ppm >= CO2_VENTILATE_MIN) {
    return { verdict: 'yes', reasonKey: 'highCo2' }
  }

  if (co2Ppm >= CO2_ELEVATED_MIN) {
    return { verdict: 'maybe', reasonKey: 'elevatedCo2' }
  }

  if (humidityHigh && outdoorAirDrier) {
    return { verdict: 'maybe', reasonKey: 'highHumidity' }
  }

  return { verdict: 'no', reasonKey: 'comfortable' }
}
