import { parseWindValue } from './parseWindValue'
import { toMetersPerSecond } from './toMetersPerSecond'

export const hourlyHourSelector = '.accordion-item.hour, .hourly-wrapper .hour'

export const parseHourlyPanel = (item: Element): Record<string, string> => {
  const panel: Record<string, string> = {}

  for (const paragraph of item.querySelectorAll('.panel p')) {
    const label = paragraph.childNodes[0]?.textContent?.trim()
    const value = paragraph.querySelector('.value')?.textContent?.trim()
    if (label !== undefined && label !== '' && value !== undefined && value !== '') {
      panel[label] = value
    }
  }

  return panel
}

export const parseHourlyWind = (item: Element) => {
  const wind = parseHourlyPanel(item).Wiatr
  if (wind === undefined) {
    throw new Error('missing "Wiatr" in hourly forecast panel')
  }

  const { direction, speed, speedUnit } = parseWindValue(wind)

  return {
    direction,
    speed: toMetersPerSecond(speed, speedUnit),
  }
}
