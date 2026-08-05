import {
  BEDROOM_COLD_MAX_C,
  BEDROOM_HOT_MIN_C,
  type TemperatureHintContext,
  type TemperatureHintKey,
  temperatureHintOrder,
} from '@/app/hints'

export type BedroomTemperatureHintsInput = {
  bedroomTempC: number | undefined
}

export const bedroomTemperatureHints = (
  input: BedroomTemperatureHintsInput,
): { hints: TemperatureHintKey[]; context: TemperatureHintContext | undefined } => {
  const { bedroomTempC } = input

  if (bedroomTempC === undefined) {
    return { hints: [], context: undefined }
  }

  const hints: TemperatureHintKey[] = []

  if (bedroomTempC >= BEDROOM_HOT_MIN_C) {
    hints.push('tooHot')
  } else if (bedroomTempC < BEDROOM_COLD_MAX_C) {
    hints.push('tooCold')
  }

  return {
    hints: temperatureHintOrder.filter(key => hints.includes(key)),
    context: { bedroomTempC },
  }
}
